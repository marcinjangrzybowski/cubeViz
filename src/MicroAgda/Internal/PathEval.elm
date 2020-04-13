module MicroAgda.Internal.PathEval exposing
    (..)

import Debug exposing (..)

import Set exposing (..)

import MicroAgda.StringTools exposing (..)

import MicroAgda.Internal.Term exposing (..)

import ResultExtra exposing (..)

import Either exposing (..)

import Dict 

import Combinatorics exposing (..)

import MicroAgda.Internal.Ctx exposing (..)


type alias PCtx = {
        list : List (String , CType , Maybe (Either () PBoundary) ),
        bounds : Dict.Dict Int Bool                   
            }

type DimIndex = DimIndex Int   
    
type alias PBoundary = Combinatorics.SubFace -> (CType , Term)
    

getFresh : PCtx -> Int
getFresh x = List.length x.list
    
nOfDimOfCtx : PCtx -> Int
nOfDimOfCtx dc = List.foldl
           (\(_ , _ , d) -> \k -> 
               case d of
                   Just (Left _) -> k + 1
                   _ -> k
                   )
           0 dc.list
           
dimOfCtx : PCtx -> Int
dimOfCtx dc = (nOfDimOfCtx dc) - (List.length (Dict.keys dc.bounds))
           
mbDim : PCtx -> CType -> Maybe Int
mbDim dc (CT ty) =
    case ty of
        (Def (BuildIn Interval) []) -> Just (dimOfCtx dc) 
        _ -> Nothing           

toVarAndIndex : PCtx -> Term -> Maybe (Int , DimIndex) 
toVarAndIndex dc tm =
    case tm of
        Def (FromContext i) []
            -> getDimIndex dc i
               |> Result.map (Tuple.pair i)
               |> Result.toMaybe  
        _ -> Nothing


getDimIndex : PCtx -> Int -> Result String DimIndex 
getDimIndex dc i =
    lookByIntInList (List.reverse dc.list) i
         |> Result.fromMaybe ("not in context")
         |> Result.andThen (\(_ , cty , x) ->
                  case cty of
                     CT (Def (BuildIn Interval) []) ->
                          Ok ()      
                     _ -> Err "not interval!"       
                            )
        |> Result.map (\() -> DimIndex (dimOfCtx (truncateCtx i dc)) )    

mkBound :  PCtx -> (Int , Bool) -> Result String PCtx
mkBound dc (i , b) =
    if (Dict.member i dc.bounds) 
    then (Err ("already in bounds! " ++ (String.fromInt i) ))
    else (if ( List.length dc.list > i )
          then Ok {dc | bounds = Dict.insert i b dc.bounds}
          else (Err "not in context!")
          )

extendI : PCtx -> String -> PCtx   
extendI dc s = {dc |
                    list =
                    (s ,  (CT (Def (BuildIn Interval) [])) , Just (Left ())) :: dc.list
                   }
               
lookCSet : PCtx -> Int -> Result String (Maybe PBoundary)             
lookCSet dc i =  
  lookByIntInList (List.reverse dc.list) i
                              |> Result.fromMaybe ("not in context")
                              |> Result.map (\(_ , _ , x) -> Maybe.map toMaybe x)
                              |> Result.map (Maybe.withDefault Nothing)  
               

truncateCtx : Int -> PCtx -> PCtx
truncateCtx i dc =
    {dc | list = dc.list |> (List.reverse >> List.take i >> List.reverse)
      , bounds = Dict.filter ((isLessThan i) >> const ) dc.bounds}                                 
           
genBound : PCtx -> (CType , Term)  -> Result String (Maybe (PBoundary))
genBound dc (ct , tm) = 
    let k = List.length dc.list in
    (    
       case (tmBIView (toTm ct) , arity ct) of
           (_ , Just 0) -> Ok Nothing
           ((JB4 PathP _ (JT (pth)) (JT (end0)) (JT (end1))) , Just 1) -> 
                Ok (Just (subFaceLI.toL >> (\l ->
                     case l of
                         (Just b) :: _ ->
                              (mkApp pth (mkIEnd b))
                              |> Result.map CT
                              |> Result.map (pairR (choose b end0 end1))                  
                              |> Result.toMaybe
                                                
                         _ -> Nothing                       
                                           ) >> Maybe.withDefault (ct , tm) ))
           ((JB4 PathP _ (JT (pth)) (JT (end0)) (JT (end1))) , Just n) -> 
                 Ok (Just (subFaceLI.toL >> (\l ->
                     case l of
                         (Just b) :: rest ->
                              (mkApp pth (mkIEnd b))
                              |> Result.map CT
                              |> Result.map (pairR (choose b end0 end1))
                              |> Result.andThen (
                                       genBound dc
                                         >> Result.andThen ((Maybe.map (
                                              \f2 ->
                                                f2 (subFaceLI.fromL rest)               
                                                        ))
                                            >> Result.fromMaybe "pathEvalError") )                   
                              |> Result.toMaybe
                         (Nothing) :: rest ->
                              todo ""
                         _ -> Nothing                       
                                           ) >> Maybe.withDefault (ct , tm) ))
           
           --(_ , Just 1) -> Just (Cub1 (\i0 -> nThColorB k (stripes i0)))
           -- (_ , Just 2) -> (circleH (nThColorB k True) (nThColorB k False))
           --                 |> constEmb
           --                 |> emb |> emb |> Cub 2 |> Just   
           _ -> Ok Nothing 
    ) |> describeErr "inGenCub"

generate : PCtx -> CType -> Result String (Maybe ( Either () PBoundary  ))
generate dc ct = 
       (genBound dc (ct , todo ""))
    |> Result.map (       
     Maybe.map (Right)       
    >> Maybe.map Just
    >> Maybe.withDefault (mbDim dc ct
       |> Maybe.map (\_ -> Left ()))           
    )           

extend : String -> PCtx -> CType -> Result String PCtx
extend vName dc ct =
  (generate dc ct)
    |> Result.andThen (\gn ->    
    case gn of
        Just g ->  Ok {dc | list = (vName ,  ct , Just g) :: dc.list }
        Nothing -> Ok {dc | list = (vName ,  ct , Nothing) :: dc.list }
   ) |> describeErr "In extend:"

emptyCtx : PCtx
emptyCtx = {list = [], bounds = Dict.empty }           

describeErr : String -> Result String x -> Result String x
describeErr s = Result.mapError (\e -> (s ++ " \n" ++ (indent 4 e)) )              
           

pathEval : (CType , Term) -> Term
pathEval (ct , tm) = mkIEnd True                
