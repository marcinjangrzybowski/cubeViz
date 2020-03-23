module MicroAgda.TypeChecker exposing (..)

import MicroAgda.Raw as R exposing (Raw)
import MicroAgda.Internal.Term exposing (..)
import MicroAgda.Internal.Ctx exposing (..)
import MicroAgda.Internal.Translate exposing (..)

import ResultExtra exposing (..)

import Tuple 

import Set exposing (..)

import Dict as Dict

import Debug exposing (todo , log)


notEqMsg : Ctx -> CType -> CType -> String
notEqMsg c tyExpected tySpotted =
    "Type error! expected: \n   " ++ (ct2str c tyExpected) ++ "\n    but spotted: " ++ (ct2str c tySpotted)

notPiMsg : Ctx -> CType -> String
notPiMsg c tySpotted =
    "Type error! expected: " ++ ("some PiType") ++ " but spotted: " ++ (ct2str c tySpotted)

notPartialMsg : Ctx -> CType -> String
notPartialMsg c tySpotted =
    "Type error! \n   expected: " ++ ("Partial Type") ++ "\n   but spotted: " ++ (ct2str c tySpotted)
        
checkAgainst : Ctx -> CType -> Result String (a , CType) -> Result String a 
checkAgainst c ty =
    Result.andThen (\(x , ty1) ->
                        if (betaEq (toTm ty) (toTm ty1))
                        then Ok x
                        else Err (notEqMsg c ty ty1)
                        )

resMaybePopOut : e -> Result e ( a, Maybe b ) -> Result e ( a, b )
resMaybePopOut e =
    Result.andThen (\(a , mb) ->
                      Result.map
                        (Tuple.pair a)
                        (Result.fromMaybe e mb)
                  )

onlyCheckResult : (a -> Result x b) -> Result x a -> Result x a        
onlyCheckResult f = Result.andThen (\a -> (f a) |> Result.map (\_ -> a))  
        
                 
checkIfPi : e -> Result e (a , CType) -> Result e (a , PiData) 
checkIfPi e =  Result.map (Tuple.mapSecond (toTm >> toPiData)) >> resMaybePopOut e

--use only after scope check!               
checkAgainstInterval : Ctx -> Raw -> Result String Term  
checkAgainstInterval c r = afterScopeCheckTC c (CT (buildIn Interval)) r

--use only after scope check! Term should be beforehand checked against interval                      
checkAgainstIsOne : Ctx -> Term -> Raw  -> Result String Term
checkAgainstIsOne c phi r =
    mkApp (buildIn IsOne) phi
    |> Result.andThen (\tyTm -> afterScopeCheckTC c (CT tyTm) r)
                    
buildInLookupCT :  String -> Maybe (BuildInToken , CType)        
buildInLookupCT s =  Maybe.map (Tuple.mapSecond CT) (buildInLookup s)

                     



scopeCheck : Ctx -> Raw -> Result String Raw
scopeCheck = symbolsSet >> R.fixAbsNames

        
lookInCtx : String -> Ctx -> String -> Result String (Term , CType)        
lookInCtx e c s =
    if (s == "TypeInf")
    then (Ok (Star , CT Star)) else
    
     let qn = lookByNameWithIndexFull c s in
               (  (Result.fromMaybe e qn)
                   --|> Result.map (Tuple.mapFirst ctxVar))
                     |> Result.map (\(nm , (ct , mbTm)) ->
                                      ((Maybe.withDefault (
                                        ctxVar nm
                                   ) mbTm) , ct) ))
                      
               |> ifErr (Result.fromMaybe e
                             (buildInLookupCT s )
                        |> Result.map (Tuple.mapFirst buildIn) )     

                  
afterScopeCheckTyTC : Ctx -> Raw -> Result String CType                  
afterScopeCheckTyTC c = (afterScopeCheckTC c (CT Star) ) >> (Result.map CT)  


                        

substOnFace : (Ctx , Term) -> List ((String , Int) , Bool) -> Result String (Ctx , Term)
substOnFace = Ok >> List.foldr (\(( n , i) , b) ->  (Result.andThen
                              (\ct -> substInCtx2 ct i (mkIEnd b , (CT mkInterval) ))))

-- substOnFaceRaw : R.Raw -> List ((String , Int) , Bool) -> Raw
-- substOnFaceRaw = List.foldr (\(( n , _) , b) ->
--                               (R.subst n (R.Var (if b then "i1" else "i0"))))               

substList : Ctx -> SubFace -> Result String (List ((String , Int) , Bool))
substList c =   
      mapListResult (
           \(it , b) ->
                case it of
                    Def (FromContext i) [] ->
                            (Result.fromMaybe ("fatal err 2")
                                 (Maybe.map (\z -> ((z , i) , b)) (lookNameByInt c i) ))
                    _ -> Err "fatal err" ) 
          

rawFaceHandle : Ctx -> List (Raw , Bool) -> Result String (List SubFace)
rawFaceHandle c l =
    (mapListResult (\(r , b) ->
                       (checkAgainstInterval c r)
                      |> Result.map (\iTm -> (if b then iTm else (mkNeg iTm ) ))) l)
  |> Result.map (List.foldr (mkMin) ((buildIn I1)) )
  |> Result.map (subFace)
     
lamPTCcase : Ctx -> CType -> List R.Raw -> (R.PartialCase ) -> Result String (List PartialCase) 
lamPTCcase c ty ts (rf , rb) =
    if List.isEmpty ts
    then    
        rawFaceHandle c rf
        |> Result.andThen (mapListResult
                      (\sf ->
                           substList c sf
                           |> Result.map (\q ->
                                    (substOnFace (c , toTm ty) q , Ok rb--Ok (substOnFaceRaw rb q)
                                    ) )
                           |> Result.andThen (
                                  thenPairResult (
                                    \(c2 , tyTm2) -> \rb2 ->
                                        afterScopeCheckTC c2 (CT tyTm2) rb2
                                        --afterScopeCheckTC c ( ty) rb2
                                       |> Result.map (partialCase sf)
                                       |> Result.mapError
                                        (\s -> "while checking partial case " ++ s) 
                                 ))

                              ))
    else Err "not implemented lamPTcase"
        
lamPTC : Ctx -> CType -> (List R.PartialCase ) -> List R.Raw -> Result String (Term , Term) 
lamPTC c ty lpc ts =
    if List.isEmpty ts
    then    
        mapListResult (lamPTCcase c ty ts) lpc
                   |> Result.map (List.concat)
                   |> Result.map (\q -> (LamP (partialCases q) [] , (collectPartialPhi q)))

    else Err "not implemented lamPTC"

                      
afterScopeCheckTC : Ctx -> CType -> Raw -> Result String Term
afterScopeCheckTC c ty rr =
    case (R.whnf rr) of
        (R.Lam _ _ , _ :: _) -> Err "Internal Error : Not a WHNF!"
        (R.Pi _ _ _ , _ :: _) -> Err "Bad application!"
        (R.App _ _ , _) -> Err "Internal Error : Not a WHNF!"
        (R.Lam s bo , [] ) ->  Result.fromMaybe (notPiMsg c ty ++ " " ++ (R.raw2String (R.Lam s bo)) )
                               (toPiData (toTm ty))
                           |> Result.andThen (\(domD , bodD) ->
                                      let cEx = extend c s (CT (domD.unDom))
                                      in
                                      (absApply bodD (Def (FromContext ( youngestSymbolId cEx )) []))
                                      |> Result.andThen
                                            (\tyTm ->
                                                 tC cEx (CT (tyTm) ) bo
                                                 |> Result.map ( mkAbs s (youngestSymbolId cEx))
                                                 |> Result.map (mkLam tyTm)
                                            )     
                                      
                                                 
                                 ) 
        (R.Pi s d b , [] ) -> afterScopeCheckTyTC c d
                             |> Result.andThen
                                 (\domCType ->
                                      let cEx = extend c s domCType
                                      in
                                      tYtC cEx b
                                      |> Result.map (
                                                     toTm
                                                  >> mkAbs s (youngestSymbolId cEx)
                                                  >> mkPi (toTm domCType))
                                 )
                             |> Result.map (\x -> Tuple.pair x (CT Star))    
                             |> checkAgainst c ty
                                 
        (R.LamP lpc , ts ) ->
            let agnst : Result String CType
                agnst = if (List.isEmpty ts)
                        then Result.fromMaybe
                             (notPartialMsg c ty ++ " \n\n while trying to TC:\n"
                                  ++ (R.raw2String rr) )
                             ((toPartialDom (toTm ty))) |> Result.map CT 
                        else (if (List.length ts) > 1 then (Err "not implemented (long ts)") else (Ok ty))
            in agnst
                |> Result.andThen (\ag -> lamPTC c ag lpc (List.drop 1 ts))
                |> Result.andThen (\(pTm , phiTm) ->
                                       case (List.head ts) of
                                           Just is1 ->
                                              checkAgainstIsOne c phiTm is1
                                              |> Result.andThen (mkApp pTm)
                                           Nothing ->
                                               case (toPartialPhi (toTm ty)) of
                                                   Nothing -> Err "internal error TC partial, imposible"
                                                   Just phiTm2 -> if (betaEq phiTm2 phiTm)
                                                                  then  Ok pTm
                                                                  else Err (notEqMsg c (CT phiTm2) (CT phiTm))
                                         )
                                       
        (R.Var s , ts) ->
            (lookInCtx "Internal Error : undefiend after scope check!" c s)
            |> thenResultFold (afterScopeCheckTCapp c) ts
            |> checkAgainst c ty 
               

tupleMapBoth2 : ( a -> b , a -> c) ->  a -> (b , c) 
tupleMapBoth2 (f , g) a = (f a , g a) 

resTuple : (Result e a , Result e b) -> Result e (a , b)                
resTuple x =
    case x of
        (_ , Err e) -> Err e
        (Err e , _) -> Err e               
        (Ok a , Ok b) -> Ok (a , b)               

afterScopeCheckTCapp : Ctx -> Raw -> (Term , CType)  -> Result String (Term , CType)
afterScopeCheckTCapp c r tt =
    checkIfPi ("Not a Function Type") (Ok tt)
   |> Result.andThen (\(tm , (dd , bd)) -> 
   (afterScopeCheckTC c (CT dd.unDom) r                               
   |> Result.andThen (tupleMapBoth2 ((mkApp tm) , piApp (dd , bd))
                          >> (Tuple.mapSecond (Result.map CT))
                          >> resTuple)))  

thenResultFold : (a -> b -> Result e b) -> List a -> Result e b -> Result e b      
thenResultFold f la rb =  List.foldl (f >> Result.andThen) rb la 
    
   
tC : Ctx -> CType -> Raw -> Result String Term
tC c ty =
    scopeCheck c
    >> Result.andThen (afterScopeCheckTC c ty)       

tYtC : Ctx -> Raw -> Result String CType        
tYtC c = (tC c ctUniv ) >> (Result.map CT)        

tYtCstart = tYtC emptyCtx

tCstart = tC emptyCtx            
         
ctUniv = (CT Star)


telescope : String -> Ctx -> CType -> List String  ->  Result String (Ctx , CType)  
telescope e c0 cty0 = 
    List.foldl (\s ->  (checkIfPi e)
                       >> Result.andThen (\(c , (do , bo)) ->
                                             (absApply bo (Def (FromContext ( (youngestSymbolId c) + 1 )) []))
                                          
                                             |> Result.map (\nTY -> (extend c s (CT (do.unDom)) ,
                                                  CT (
                                                      
                                                      nTY
                                                     ))
                                             )
                                         ))               
                    (Ok (c0 , cty0))
            
-- tCAbs : Ctx -> CType -> String -> Raw ->         

unTelescope : (Ctx , Term) -> List String -> (Ctx , Term)
unTelescope = List.foldr
              ( \s -> \(c , tm) -> (List.drop 1 c , mkLamUnsafe ( mkAbs s (youngestSymbolId c) tm)) )

                  

                  
