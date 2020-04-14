module MicroAgda.Viz.Structures exposing (..)

import MicroAgda.Raw as R
import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T

import MicroAgda.Drawing exposing  (..)

import MicroAgda.StringTools exposing (..)

import Either exposing (..)

import Color

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict

import Set

import Combinatorics exposing (..)

type CSet = CSet (Inside) |  Degen Int (CSet)

    
type ECtx = EInterval | ECSet (Inside) 

type alias DCtx = {
        uniqs : Int -> Int,
        uniqsPc : Int -> Int,    
        list : List (String , C.CType , Maybe (ECtx) ),
        bounds : Dict.Dict Int Bool                   
            }

type DimIndex = DimIndex Int   
    

                                      
type alias Inside = (Int , Subset -> ((Int , Int) , Int))
-- ((gloablly uniq per corner square, uniq per color) , colorInt)
    
type alias Boundary a = Face -> a
    
type alias N1 = {term : I.Term} 

type alias N2 = { head : Int
                , tailClean : List (I.Term)
                , original : Bool              
                , tailPieces : TailPieces  }        

type alias N3 = { zones : Piece -> Drawing DStyle }
    
type alias N4 = {  whole : Drawing MetaColor }
    
type alias StepNo a b = DCtx -> Int -> I.Term -> Address -> a -> Result String b

type Cub a = Cub I.Term a | Hcomp I.Term String (SubFace -> Maybe (Cub a)) (Cub a)

type alias Address = List (SubFace) 
    
    
stepMap : StepNo a b ->
          (Result String (DCtx , Int , Cub a))
              -> (Result String (DCtx , Int ,  Cub b))    
stepMap f =

    let 
         stepMapIns : Address ->
              (Result String (DCtx , Int , Cub a))
                 -> (Result String (DCtx , Int ,  Cub b))    
         stepMapIns adrs  =
    
            Result.andThen (\(dc , n , ca) ->
                        ( case ca of
                             Cub tm a -> f dc n tm adrs a |> Result.map (Cub tm) 
                             Hcomp tm vName sides cap ->
                                stepMapIns
                              (adrs ++ [subFaceCenter n])
                              (Ok (dc , n , cap))
                                |> Result.andThen (
                                  \(_ , _ , cap2) ->
                                      mapAllLI subFaceLI n (doAndPairR sides)
                                     |> mapListResult
                                         ((\ (sf , ma) ->
                                            (mkBoundSF dc sf) |> Result.andThen (\dc2 ->
                                            let
                                                dc3 = extendI dc2 vName
                                                n3 = dimOfCtx dc3
                                            in
                                               Maybe.map (\a -> stepMapIns (adrs ++ [sf]) (Ok (dc3 , n3 , a))) ma
                                               |> maybeMixRes
                                               |> Result.map (Maybe.map (\(_ , _ , x) -> x))
                                               |> Result.map (Tuple.pair sf)
                                             )
                                          ))
                                     |> Result.map (List.filterMap
                                               (\(sf , mb) -> mb |> Maybe.map ( Tuple.pair sf)))
                                     |> Result.map
                                      (\sides2 ->
                                           Hcomp tm
                                           vName
                                           (makeFnSubFace sides2)
                                           cap2
                                      ) 
                                                  )
                                

                        ) |> Result.map (\x -> (dc , n , x))
                   )  
    in stepMapIns []
                
                
cubMap : (y -> z) -> Cub y -> Cub z
cubMap f pcb = 
    case pcb of
        Cub tm x -> x |> f |> Cub tm
        Hcomp tm vName si bot
            ->  cubMap f bot
                |> (Hcomp tm vName ( si  >> Maybe.map (cubMap f)  ))
                       

cubMapSubFace : (SubFace -> SubFace) -> Cub y -> Cub y
cubMapSubFace f pcb = 
    case pcb of
        Cub tm x -> Cub tm x
        Hcomp tm vName si bot
            ->
                cubMapSubFace f bot
                |> Hcomp tm vName ( f >> si >> Maybe.map (cubMapSubFace f)  )
          

cubMapAtNode : (DCtx -> Int -> I.Term -> x -> Result String x)
                 -> Address -> (Result String (DCtx , Int , Cub x))
                 -> Result String (Cub x)
cubMapAtNode f adrs =
    Result.andThen (\(dc , n , cx)->
          case (cx , adrs) of
              (Cub tm x , []) -> f dc n tm x |> Result.map (Cub tm) 
              (Cub _ _ , _) -> Err ("too long address")          
              (Hcomp tm vName si cup , h :: tl)
                  -> case subFaceCases h of
                         Nothing ->
                              cubMapAtNode f tl (Ok (dc , n , cup))
                           |> Result.map (Hcomp tm vName si)
                         Just (SubFace nSF sfi) ->
                              ((si (SubFace nSF sfi))
                              |> Maybe.map ( \y ->
                                            let sf = (SubFace nSF sfi) in 
                                            (mkBoundSF dc sf) |> Result.andThen (\dc2 ->
                                            let
                                                dc3 = extendI dc2 vName
                                                n3 = dimOfCtx dc3
                                            in cubMapAtNode f tl (Ok (dc3 , n3 , y))
                                            )
                                   )
                              |> maybeMixRes
                              ) 
                           |> Result.map (\mapped ->
                                (\(SubFace nA sfiA) ->
                                 if (sfiA == sfi)
                                 then mapped
                                 else si (SubFace nA sfiA)
                                   ))
                           |> Result.map (\si2 -> Hcomp tm vName si2 cup)
              (Hcomp _ _ _ _ , [])
                  -> Err ("too short address")
               )

type alias AllWorkType =  (DCtx , Int , (Cub N2 , Drawing (MetaColor)))        
type alias AllWork = (C.CType , I.Term) -> Result String AllWorkType 

    

    
type alias Tm2Cub = DCtx -> I.Term -> Result String (Cub N2)

type alias TailPieces = List (Piece -> (Int , Bool))

-- varia


describeErr : String -> Result String x -> Result String x
describeErr s = Result.mapError (\e -> (s ++ " \n" ++ (indent 4 e)) )              
    
-- Context


getFresh : DCtx -> Int
getFresh x = List.length x.list
    
nOfDimOfCtx : DCtx -> Int
nOfDimOfCtx dc = List.foldl
           (\(_ , _ , d) -> \k -> 
               case d of
                   Just (EInterval) -> k + 1
                   _ -> k
                   )
           0 dc.list


-- TOODO : shoul output Result String Int                
fromDimIndex : DCtx -> DimIndex -> Int
fromDimIndex dc (DimIndex k) =
      dc.list
   |> List.reverse       
   |> List.indexedMap Tuple.pair       
   |> List.filter (\(i , (_ , _ , x)) ->
           case x of
               Just EInterval -> not (Set.member i (Dict.keys dc.bounds |> Set.fromList) )  
               _ -> False        
                  )
   |> ResultExtra.swap lookByIntInList k
   |> Maybe.map Tuple.first   
   |> Maybe.withDefault -1   

dimIndexToName : DCtx -> DimIndex -> Maybe String      
dimIndexToName dc x = C.lookNameByInt (toCtx dc) (fromDimIndex dc x)
      
dimOfCtx : DCtx -> Int
dimOfCtx dc = (nOfDimOfCtx dc) - (List.length (Dict.keys dc.bounds))



              
mbDim : DCtx -> C.CType -> Maybe Int
mbDim dc (C.CT ty) =
    case ty of
        (I.Def (I.BuildIn I.Interval) []) -> Just (dimOfCtx dc) 
        _ -> Nothing           

toVarAndIndex : DCtx -> I.Term -> Result String (Int , DimIndex) 
toVarAndIndex dc tm =
    case tm of
        I.Def (I.FromContext i) []
            -> getDimIndex dc i
               |> Result.map (Tuple.pair i) 
        _ -> Err "not in normal form"


getDimIndex : DCtx -> Int -> Result String DimIndex 
getDimIndex dc i =
    lookByIntInList (List.reverse dc.list) i
         |> Result.fromMaybe ("not in context ctxLen:"
                                  ++ (String.fromInt (dc.list |> List.length) )
                                  ++ " tried: " ++ ( String.fromInt i )
                             )
         |> Result.andThen (\(_ , cty , x) ->
                  case cty of
                     C.CT (I.Def (I.BuildIn I.Interval) []) ->
                          Ok ()      
                     _ -> Err "not interval!"       
                            )
        |> Result.map (\() -> DimIndex (dimOfCtx (truncateCtx i dc)) )    
        |> describeErr "getDimIndex"
        -- |> Result.mapError (\e ->
        --        let _ = log ("not in context : " ++ (String.fromInt i)
        --                          ++ " "
        --                          ++ (String.fromInt (List.length (List.reverse dc.list))) ++ " "  )
        --             (List.map (\(_ , _ , x) -> x) dc.list)
        --        in e)   
           
mkBound :  DCtx -> (Int , Bool) -> Result String DCtx
mkBound dc (i , b) =
    if (Dict.member i dc.bounds) 
    then (Err ("already in bounds! " ++ (String.fromInt i) ))
    else (if ( List.length dc.list > i )
          then Ok {dc | bounds = Dict.insert i b dc.bounds}
          else (Err "not in context!")
          )

        
mkBoundSF : DCtx -> SubFace -> Result String DCtx
mkBoundSF dc =
        subFaceLI.toL
     >> List.indexedMap (Tuple.pair)
     >> List.filterMap (\(i , mx) ->
             mx |> Maybe.map (Tuple.pair (fromDimIndex dc (DimIndex i)))) 
     >> List.foldr (\(i , b) -> Result.andThen (\rdc -> mkBound rdc (i , b) )) (Ok dc)   
            
extendI : DCtx -> String -> DCtx   
extendI dc s = {dc |
                    list =
                    (s ,  (C.CT (I.Def (I.BuildIn I.Interval) [])) , Just EInterval) :: dc.list
                   }
extendInth : Int -> DCtx -> (DCtx , List String) 
extendInth k dc =
    let ss = dc |> toCtx |> C.symbolsSet |> Set.union I.buildInNamesSet
        names = makeFreshList (padRight k "i" (String.split "" "ijkl")) ss
    in
    List.foldl (ResultExtra.swap extendI) dc names
    |> pairR names    

   
toCtx : DCtx ->  C.Ctx 
toCtx dc =
    dc.list
    |> List.map (\(s , ct , _) -> ((s , ct) , Nothing))    
    
subfaceCtx : DCtx -> String -> SubFace -> Result String DCtx 
subfaceCtx dc vName sf = mkBoundSF dc sf |> Result.map (ResultExtra.swap extendI vName) 
             
toInside : ECtx -> Maybe Inside
toInside dd =
    case dd of
        ECSet x -> Just x
        _ -> Nothing


lookDCtxIns : DCtx -> Int -> Result String (String , C.CType , Inside)
lookDCtxIns dc i =   lookByIntInList (List.reverse dc.list) i
                              |> Result.fromMaybe ("not in context")
                              |> Result.andThen (\(name , ct , x) ->
                                         x  
                                      |> Maybe.map toInside
                                      |> Maybe.map (Maybe.map (\y -> (name , ct , y)))               
                                      |> Result.fromMaybe "inside not defined"               
                                               )
                              |> Result.andThen (Result.fromMaybe "defined but not cubical")
           
lookInside : DCtx -> Int -> Result String Inside             
lookInside dc i =  
  lookByIntInList (List.reverse dc.list) i
                              |> Result.fromMaybe ("not in context")
                              |> Result.andThen (\(_ , _ , x) ->
                                         x  
                                      |> Maybe.map toInside
                                      |> Result.fromMaybe "inside not defined"               
                                               )
                              |> Result.andThen (Result.fromMaybe "defined but not cubical")
                                 
               
-- uniqs not handledwell !! 
truncateCtx : Int -> DCtx -> DCtx
truncateCtx i dc =
    {dc | list = dc.list |> (List.reverse >> List.take i >> List.reverse)
      , bounds = Dict.filter ((isLessThan i) >> const ) dc.bounds}                                 


-- cub2String : Int -> (a -> String) -> Cub a -> String
-- cub2String n f ca =
--     case ca of
--         Cub _ x -> f x
--         Hcomp _ vName sides cup
--             ->
--               ((tabulateSubFaces n (
--                  \sf ->
--                         sides sf
--                      |> Maybe.map (\ca2 -> cub2String ((getSubFaceDim sf) + 1) f ca)
--                ) |> List.map (\(x , y) -> y) |> String.join "\n" ) 
--                ++ "\n" ++ (cub2String n f cup))
addOn : Int -> Int -> (Int -> Int) -> (Int -> Int)
addOn i x f j =
   if (i == j)
   then ((f j) + x)        
   else f j        
        
genCub : DCtx -> C.CType -> Result String (Maybe (Inside , (Int -> Int , Int -> Int) ))
genCub dc ct = 
    -- let k = List.length dc.list in
    (    
       case (I.tmBIView (C.toTm ct) , C.arity ct) of
           (_ , Just 0) -> let freshColorId = dc.uniqs 0 in
                           Ok (Just (
                          (0 ,
                            const ((0 , 0) , freshColorId) 
                          )
                         ,
                              (
                               addOn 0 1 dc.uniqs
                               , dc.uniqsPc
                              )
                                    ))
           (_ , Just n) ->
                            cuTyCornerColorId dc ct
                           |> Result.map (\corF ->
                              (Just (
                                     let (ins , upc2) =
                                           (mapAllLI (subsetLI) n (\x -> (x , (corF x)))
                                           |> List.foldr (
                                                 \(corn , cc) -> \(l , upc) ->
                                                       ((( corn , (
                                                 ((subsetLI.toI corn) + dc.uniqs n
                                                  , (upc (corF corn))) 
                                                , corF corn )) :: l) ,
                                                       addOn cc 1 upc
                                                       )
                                                              
                                                         ) ([], dc.uniqsPc)      
                                           |> Tuple.mapFirst ( 
                                                                                
                                                              makeFnLI (subsetLI)
                                                             >> postcompose (
                                                                  Maybe.withDefault ((-1 , -1) , -1)
                                                                             )
                                                              
                                                             ))
                                     in 
                                         ((n , ins)
                                           ,
                                        
                                           ( addOn n (2 ^ n) dc.uniqs
                                            ,
                                             upc2   

                                           ))
                                    ))
                              )
           _ -> Ok Nothing                        
    ) |> describeErr "inGenCub"

generate : DCtx -> C.CType -> Result String (Maybe (ECtx , (Int -> Int , Int -> Int) ))
generate dc ct = 
      mbDim dc ct
   |> Maybe.map (\_ -> (EInterval ,
           (dc.uniqs , dc.uniqsPc) ) |> Ok)    
   |> maybeTry (genCub dc ct
               |> resMixMaybe
               |> Maybe.map (Result.map (Tuple.mapFirst ECSet)))
   |> maybeMixRes   

extend :  String -> DCtx -> C.CType -> Result String DCtx
extend vName dc ct =
  (generate dc ct)
    |> Result.andThen (\gn ->    
    case gn of
        Just (g , (u , uPc)) ->  Ok {dc | list = (vName ,  ct , Just g) :: dc.list
                                  , uniqs = u , uniqsPc = uPc }
        Nothing -> Ok {dc | list = (vName ,  ct , Nothing) :: dc.list }
   ) |> describeErr "In extend:"

emptyCtx : DCtx
emptyCtx = {list = [], uniqs = const 0 , uniqsPc = const 0 , bounds = Dict.empty }           


---

termFace : DCtx -> Face -> I.Term -> Result String I.Term
termFace dc (i , b) tm =
    let termI = fromDimIndex dc (DimIndex i)
                
    in I.substIC2 termI (I.mkIEnd b) tm
       |> describeErr ("termFace")
   
-- termSubFace : DCtx -> SubFace -> I.Term -> Result String I.Term
-- termSubFace dc sf tm =
--     todo ""

toPoint : DCtx -> I.Term -> Result String (Int)
toPoint dc tm =
    case tm of
        (I.Def (I.FromContext i) [])
            -> case (lookInside dc i) of
                   Ok (0 , f) -> Tuple.second (f (Subset 0 0)) |> Ok
                   Err e -> Err e              
                   _ -> Err "not a point" 
        _ -> Err "not a point"                                
          
cuTyCornerColorId : DCtx -> C.CType -> Result String (Subset -> Int)
cuTyCornerColorId dc ct =
      C.arity ct |> Result.fromMaybe "arity not detteceted"
       |> Result.andThen
      (\arr -> mapAllLI subsetLI arr
         (\ss -> cuTyCorner ct ss
                |> Result.andThen (toPoint dc)
                |> Result.map (Tuple.pair ss))
      |> mapListResult identity
      |> Result.map (makeFnLI subsetLI)
      |> Result.map (postcompose (Maybe.withDefault (-1)))   
      |> describeErr ("cuTyCornerColorId")   
      )
    
cuTyCorner : C.CType -> Subset -> Result String I.Term
cuTyCorner (ct) ss =
    let n = lengthLI subsetLI ss 
        l = subsetLI.toL ss
    in C.arity ct |> Result.fromMaybe "arity not detteceted"
       |> Result.andThen (\art ->    
          if (art) /= n
          then (Err ("order of face bigger than arity"))    
          else
              case (I.tmBIView (C.toTm ct) , art , l) of
                  (_ , _ , []) -> Err ("not a path type!")
                  (_ , 0 , _) -> Err ("not a path type!")
                  ((I.JB4 I.PathP _ (I.JT (pth)) (I.JT (end0)) (I.JT (end1))) , _ , b :: tl)
                      ->
                     case tl of
                         [] -> Ok (choose b (end0) (end1))
                         _ ->  
                               I.mkApp pth (I.mkIEnd b)
                               |> Result.andThen (\x -> cuTyCorner (C.CT x) (subsetLI.fromL tl))     
                  (_ , _ , _) -> Err ("not a path type!")         
                 )


-- return error for "full" subface
-- WARINING! i am not shure if it works for dim>=3 


               
makeGenericTerm : DCtx -> Int -> Result String (I.Term , DCtx)
makeGenericTerm dc i =
          lookDCtxIns dc i
   |> Result.andThen (
       \(nameTy , ct , ( n , _)) ->
            let (dcc , nms) = (extendInth n (truncateCtx (i + 1) dc) ) in
            C.arity ct |> Result.fromMaybe "arity not detteceted"    
            |> Result.andThen (\na ->
                  if na /= n
                  then Err "generated data not consistent with type arity"
                  else
                    if n == 0
                    then Ok (I.ctxVar i)
                    else (    
                              TC.getBaseType ct
                            |> Result.andThen (\bct -> 
                               let rtm =
                                        nms            
                                     |> List.foldl (\name -> \rawTerm ->
                                                        R.App (rawTerm) (R.Var name)  )
                                                   (R.Var (nameTy))    
                               in TC.tC
                                  (toCtx dcc)
                                  (bct)
                                  rtm
                                  |> describeErr ("tc er : ") 
                                                   
                             
                     )   )         
                              )  |> Result.map (pairR dcc)  
       ) |> describeErr ("makeGenericTerm : ")
      
-- can be easily generalized to subfaces
contextualizeFace : DCtx -> Int -> Face -> C.CType -> Result String (DCtx , I.Term)       
contextualizeFace dc n (i , b) ct =

     mkBoundSF dc (faceToSubFace n (i , b))
     |> Result.andThen (\dcSF ->    
     TC.cuTyFace (toCtx dc) ct (i , b)
      |> Result.andThen
          (\tm ->
             List.foldl
               (\j -> Result.andThen ( \tmF ->
                let jj = fromDimIndex dcSF (DimIndex j)
                in I.mkApp tmF (I.ctxVar jj) 
                
               ))
               (Ok tm) (range (n - 1))
              
          )                   

      |> Result.map (Tuple.pair dcSF)
    ) |> describeErr "contextualizeFace"                       
    -- case newDims of
    --     0 -> Ok (dc , tm)
    --     _ -> todo ""     
    
-- contextualizeCub : Int -> Int -> I.Term -> Result String (I.Term)
-- contextualizeCub startI dims tm =
--     (case dims of
--         0 -> Ok tm
--         1 -> I.mkApp tm (I.ctxVar startI)     
--         _ ->
--                 contextualizeCub startI (dims - 1) tm
--              |> Result.andThen (\tm2 -> I.mkApp (tm2) (I.ctxVar (startI + dims - 1)))
--     ) |> describeErr "contextualizeCub"



-- logDCtx : (x -> DCtx) -> x -> x
-- logDCtx f x =
--     let dc = f x in
--     log ("ctx of length : " ++  String.fromInt (List.length dc.list) ++ "\n"
--           ++
--           ((List.indexedMap (\i -> \(name , _ , mb) ->
--                                  case mb of
--                                      Just (EInterval) ->
--                                                case (Dict.get i dc.bounds , getDimIndex dc i) of
--                                                    (Just j , _) -> "(" ++name ++ "="
--                                                                  ++ (choose j "i0" "i1") ++ ")"
--                                                    (_ , Ok (DimIndex k)) -> "(" ++name ++ " di-"
--                                                                  ++ (String.fromInt k) ++ ")"
--                                                    _ -> "fatal - logDCtx"
--                                      _ -> name
--                             )
--                 (dc.list |> List.reverse))
--           |> String.join (","))   
--         ) x



                
flipAddress : Int -> Address -> Address 
flipAddress k =
    List.map (
      mapAsList subFaceLI (
                  swapLastWithIth k
                    -- identity
                          )
              )
    
toPreOF : Address -> Address
toPreOF adrs =
    
    case adrs of
        [] -> []
        h :: tl -> h ::
               ((
                let tll = toPreOF tl in
                case (subFaceCases h) of
                    Nothing -> tll
                    Just sf ->
                        case (toFaceForce sf) of
                            Nothing -> []
                            Just (k , b) ->
                                -- let _ = log "x" sf in
                                flipAddress k tll --|> toPreOF           
               ) )
