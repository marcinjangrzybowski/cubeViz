module MicroAgda.Viz exposing (..)

import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T

import MicroAgda.Drawing exposing  (..)

import MicroAgda.StringTools exposing (..)

import Color

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict

import Set

import Combinatorics exposing (..)


type alias Cell = Piece -> CSet
    
type alias Boundary = Face -> Cell   
    
type CSet = CSet Int Boundary (Inside) --(((Int -> Bool) -> Float))
            | CPoint Int | Degen Int CSet
    
type DData = DSet CSet | Dim
    
type alias DCtx =
    {
        uniqs : Int -> Int,
        list : List (String , C.CType , Maybe DData),
        bounds : Dict.Dict Int Bool               
    } 


    
type PCubA y x = PCubA x | HcompA (y -> Maybe (PCubA y x)) (PCubA y x)
type PCubB y x = PCubB x | HcompB (y -> PCubB y x) (PCubB y x)    

type alias CubAA = PCubA SubFace ( DCtx , Int , List I.Term )     
    
type alias CubAB = PCubA SubFace ( Cell )     

type alias CubAC a = PCubA SubFace ( a )
    
-- type alias CubAC a = PCubA SubFace ( a )

type alias CubBB a = PCubB Face ( a )
-- bool here means it is "filled" , true, means that cell was missing and was filled

    
type Shps = Shps    

type DimIndex = DimIndex Int    

type alias Inside = List Bool -> Int
    

-- conventions

-- Piece - permutation - subset (most prompt to mistakes!)
-- indexes in perm and subset have diferent meaning!
-- nth Bool in subset regards nth Variable, subset is specyfing corners, afer chaing permutation,
-- meaning behind subset is NOT changing
-- meaning of permutation : if you act permutation on Range 0 (dim -1) ,
-- you will get sorted (by Value , not index of variable!) variables in ASCENDING order! , (meaning distance from the "point" to face)
-- IMPORTANT! bool convantion can be tricky! see pieceEval why!

-- Boundary - Face
-- Face (n , false/true) - means nth variable have value of 0/1 

-- Inside - Subset
-- subset means here corner - nth bool is interpreted as nth variable like in boundary


    

piecesStrat : DCtx -> I.Term -> Result String (Piece -> (Maybe Int , Bool))      
piecesStrat dc tm =
    let fList : Result String (List (Piece , (Maybe Int , Bool)))
        fList =
           mapAllPieces (dimOfCtx dc) (\pc ->
              pieceEval dc tm pc |> (\tm1 ->
                 case tm1 of
                    I.Def (I.BuildIn I.I1) [] -> Ok (Nothing , True)
                    I.Def (I.BuildIn I.I0) [] -> Ok (Nothing , False)
                    I.Def (I.FromContext k) [] ->
                                         getDimIndex dc k
                                         |> Result.map(\(DimIndex j) -> (Just j , True))
                    I.Def (I.BuildIn I.Neg) [x] ->
                           case I.elimArg x of
                               I.Def (I.FromContext k) [] ->
                                            getDimIndex dc k
                                         |> Result.map(\(DimIndex j) -> (Just j , False))
                               _ -> Err "pieces strat error 2"                     
                    _ -> Err "pieces strat error"                     
                                      ) |> Result.map (Tuple.pair pc) )
          |> mapListResult identity     
    in fList |> Result.map makeFnPiece
             |> Result.map (\f -> f >> Maybe.withDefault (Nothing , True))           
              
transA1 : ( DCtx , Int , List I.Term )
            -> Result String ((Int , CSet) , List (Piece -> (Maybe Int , Bool)))
transA1 ( dc , tm , tl) =
    let cdim =
               -- log (String.fromInt (getFresh dc))
               (dimOfCtx dc) in
     lookCSet dc tm
   |> Result.andThen (    
      Result.fromMaybe "wrong head , unable to produce CSet"     
   >> Result.andThen (\hd ->
         mapListResult (piecesStrat dc) tl
        |> Result.map (\tll ->
                    ((cdim , hd) , tll)
                         )                  
                 )
          
   )   
transA2 :  ( (Int , CSet) , List (Piece -> (Maybe Int , Bool)))
            -> (Piece -> (CSet))
transA2 ((cdim , cs) , lpib) p =    
   let ll = List.map (\x -> x p) lpib in
   let l = List.filterMap (\(x , y) -> x |> Maybe.map (\z -> (z , y)  )) ll in
   (const cs)
   |> handleProjections (ll |> List.map (\(mbi , b) ->
                                       mbi
                                       |> Maybe.map (const Nothing)
                                       |> Maybe.withDefault (Just b) ))
   |> flipAll (List.map Tuple.second l)
   |> rearangeCell (List.map Tuple.first l)   
   -- |> swapAll (List.map Tuple.first l)
   |> diagAll   
   |> degenMissing cdim          
   |> applyTo p


      
             
       
tm2Cub : DCtx -> I.Term -> Maybe (Cell)
tm2Cub dc tm =
    case tm of
        I.Def (I.FromContext i) tl
            -> transA1 (dc , i , List.map I.elimArg tl)
               |> Result.map transA2
               |> Result.toMaybe   
        _ -> Nothing     
       
-------------------
-- subfunctions

makeDrawCtx : (C.CType , I.Term) -> Result String (I.Term , DCtx)
makeDrawCtx (ct0 , tm0) = maybeLoop
                  (convergeResult (\_ -> Nothing )
                       (\((ct , tm) , dc) ->
                            ct |> C.toTm |> I.toPiData
                            |> Maybe.map (\(do , bo) ->
                                (I.absApply bo (I.Def (I.FromContext ( (List.length dc.list) )) []))
                                |> Result.andThen (\tyTm  -> (
                                                 (I.mkApp tm (I.ctxVar ((List.length dc.list))))     
                                                 |> Result.andThen (\nTm ->      
                                                          ((C.CT tyTm , nTm) ,
                                                              (extend dc (C.CT do.unDom)  )

                                                          ) |> resultPairR ))
                                              )             
                                              
                                         )
                       )
                  )
                  
                 (Ok ((ct0 , tm0), emptyCtx))
                |> Result.map (\((_ , t) ,c ) -> (t , c)) 

extend : DCtx -> C.CType -> Result String DCtx
extend dc ct =
    (generate dc ct)
    |> Result.andThen (\gn ->    
    case gn of
        Just (g , u) ->  Ok {dc | list = ("" ,  ct , Just g) :: dc.list , uniqs = u }
        Nothing -> Ok {dc | list = ("" ,  ct , Nothing) :: dc.list }
                --  Err ("nothing generated : " ++ (T.t2strNoCtx (C.toTm ct))) --{dc | list = ("" ,  ct , Nothing) :: dc.list  }                
   ) |> describeErr "In extend:"

extendI : DCtx -> String -> DCtx   
extendI dc s = {dc |
                    list =
                    (s ,  (C.CT (I.Def (I.BuildIn I.Interval) [])) , Just Dim) :: dc.list
                   }
           
mkBound :  DCtx -> (Int , Bool) -> Result String DCtx
mkBound dc (i , b) =
    if (Dict.member i dc.bounds) 
    then (Err ("already in bounds! " ++ (String.fromInt i) ))
    else (if ( List.length dc.list > i )
          then Ok {dc | bounds = Dict.insert i b dc.bounds}
          else (Err "not in context!")
          )    
                 
arity : C.CType -> Maybe Int
arity x =
    case (I.toPiData (C.toTm x)) of
        Just (do , cod) ->
            case (do.unDom , cod.unAbs) of
                 ((I.Def (I.BuildIn I.Interval) []) , y) -> (arity (C.CT y))
                                                            |> (Maybe.map (\z -> z + 1))
                 _ -> Nothing   
        Nothing -> case C.toTm x of
                       (I.Def (I.FromContext _) []) -> Just 0
                       (I.Var _ []) -> Just 0                                
                       _ -> Nothing


succOn : Int -> (Int -> Int) -> (Int -> Int)
succOn i f j =
   if (i == j)
   then (succ (f j))        
   else f j

addOn : Int -> Int -> (Int -> Int) -> (Int -> Int)
addOn i x f j =
   if (i == j)
   then ((f j) + x)        
   else f j        

-- pathEnd : Bool -> I.Term -> C.CType 
-- pathEnd =  


    
        
         
genCub : DCtx -> C.CType -> Result String (Maybe (CSet , Int -> Int ))
genCub dc ct = 
    let k = List.length dc.list in
    (    
       case (I.tmBIView (C.toTm ct) , arity ct) of
           ((I.JB4 I.PathP _ (I.JT (pth)) (I.JT (end0)) (I.JT (end1))) , Just 1) ->
              case ((tm2Cub dc end0) , (tm2Cub dc end1)) of
                  (Just c1 , Just c2) ->
                        Ok (Just ((CSet 1 (\(_ , b) -> choose b c1 c2 )
                                       (inside (dc.uniqs 1))) ,
                                      addOn 1 (2 ^ 1) dc.uniqs))
                  _ -> Err "unable to parse ends"
            -- Just (
            --          constEmb (\i -> choose (stripes i) (nThColor x0) (nThColor x1))
            --         |> emb
            --         |> Cub 1  
            --      )
           (_ , Just 0) -> Ok (Just ((CPoint (dc.uniqs 0)) ,  succOn 0 dc.uniqs ))
           --(_ , Just 1) -> Just (Cub1 (\i0 -> nThColorB k (stripes i0)))
           -- (_ , Just 2) -> (circleH (nThColorB k True) (nThColorB k False))
           --                 |> constEmb
           --                 |> emb |> emb |> Cub 2 |> Just   
           _ -> Ok Nothing 
    ) |> describeErr "inGenCub"


-- getTypeBoundary : DCtx -> C.CType -> Maybe Boundary
-- getTypeBoundary dc ct = 

         
generate : DCtx -> C.CType -> Result String (Maybe (DData , Int -> Int ))
generate dc ct = 
       (genCub dc ct)
    |> Result.map (       
     Maybe.map (Tuple.mapFirst DSet)       
    >> Maybe.map Just
    >> Maybe.withDefault (mbDim dc ct
       |> Maybe.map (\_ -> (Dim ,
           dc.uniqs )))           
    )           

    
flipAll : List Bool -> Cell ->  Cell
flipAll lb cs = List.foldr
        (Maybe.map (cellFlip) >> Maybe.withDefault identity )
            cs (lb
                |> List.map (not >> bool2Mb)   
                |> List.indexedMap (const >> Maybe.map ))



                

rearangeCell : List Int -> Cell ->  (Cell , List Int)          
rearangeCell l0 cl0 =
    let
        rCell : List Int -> Cell -> Cell          
        rCell l cl = 
          (let  
               sortingPerm : Permutation
               sortingPerm = sortPerm l

               permuteBoundary : Permutation -> Boundary -> Boundary
               permuteBoundary p bd (i , b) = 
                     let j =  permuteInt p i  in
                         (j , b)
                         |> bd
                         |> rearangeCell ((toUsual p) |> (removeFromList j)
                                         |> List.map (punchOut i)  )
                         |> Tuple.first
               
               permuteInside : Permutation -> Inside -> Inside
               permuteInside = permuteList >> precompose   

               rearanged : Cell
               rearanged p =
                   case cl (prePermutePiece sortingPerm p) of
                       CSet n bo ins
                           -> CSet n
                              (permuteBoundary sortingPerm bo)
                              (permuteInside sortingPerm ins)
                       Degen k cst -> Degen
                                      (permuteInt (invPermutation sortingPerm) k)
                                      (rCell (removeFromList k l) (const cst) (Piece 0 0 0) )            
                       CPoint x -> CPoint x            
           in rearanged) 
    in ( rCell l0 cl0 , l0 |> List.sort)

-- assumes that cell is not malformed in any way
dimOfCell : Cell -> Int
dimOfCell cl = (cl (Piece 0 0 0)) |> dimOfCSet

dimOfCSet : CSet -> Int
dimOfCSet cs =
    case cs of
        CSet n _ _ -> n
        CPoint _ -> 0
        Degen _ x -> 1 + (dimOfCSet x)

               
diagCell : Cell -> Cell
diagCell cl p =
    let

        diagBoundary : Boundary -> Boundary
        diagBoundary bd (i , b) =
            case i of
                0 -> bd (0 , b) |> cellBorder |> applyTo (0 , b)
                _ -> diagCell (bd (i + 1 , b))   
                  
        diagInside : Inside -> Inside
        diagInside =
            precompose
            (\lb -> List.head lb |> Maybe.map (\h -> h :: lb) |> Maybe.withDefault lb)           

    in
    case cl (diagPiece p) of
        CSet n bo ins -> CSet (n - 1) (diagBoundary bo) (diagInside ins)
        Degen 0 cst -> cst
        Degen 1 cst -> cst
        Degen k cst -> Degen (k - 1) (diagCell (const cst) (Piece 0 0 0))               
        CPoint x -> CPoint x               

mapCellUnder : (Cell -> Cell) -> Cell -> Cell
mapCellUnder f = fake identity


cellToString : Cell -> String
cellToString cl =
    printPiecesFn (dimOfCell cl) cSet2Str cl
        

cSet2Str : CSet -> String             
cSet2Str cs =
   (case cs of
        CSet n bo ins -> "CSet " ++ (String.fromInt n)
                        
        Degen k cst -> "Degen " ++  (String.fromInt k)
                        ++ " " ++ cSet2Str cst               
        CPoint x -> "CPoint " ++ (String.fromInt x)
   )  
  |> (\x -> "( " ++ x ++ " )")
     
-- here l must be sorted!!              
diagAll : (Cell , List Int) ->  (Cell , List Int)          
diagAll (cs , l) =
    ((case l of
        [] -> cs
        x :: [] -> cs
        x :: y :: tl -> if x == y
                        then diagAll (diagCell cs , y :: tl) |> Tuple.first
                        else ( mapCellUnder (\cc -> diagAll (cc , y :: tl) |> Tuple.first) cs )
     )
    , (removeDupes l))
    
                            
degenMissing : Int -> (Cell , List Int) -> Cell          
degenMissing dim (cl ,  li) p =
    -- log ( (cellToString cl ) ++ "   args: "
    --           -- ++ (List.map String.fromInt li |> String.join "," )
    --     )
     li
    -- |>  List.map (\x -> log (String.fromInt x) x)   
    |> List.foldl (Set.remove) (Set.fromList (range dim))
       
    -- |> log ((String.fromInt dim) ++ " mis:")    
    |> (\si -> List.foldl Degen (cl (degenPiece si p)) (Set.toList si))   
      
handleProjections : List (Maybe Bool) -> Cell ->  Cell          
handleProjections lmb cs =
    List.foldr
        (Maybe.map (\(i , b) -> cellFace i b) >> Maybe.withDefault identity )
            cs (List.indexedMap (\i -> Maybe.map (Tuple.pair i) ) lmb)


    
                

cellBorder : Cell -> Boundary
cellBorder cl (i , b) p =
    case cl (pieceInj i b p) of
        CSet _ bd _ -> bd (i , b) p 
        Degen k cse -> if k == i
                       then cse
                       else
                           let kk = (punchOut i k) in
                           let ii = (punchOut k i) in
                           Degen kk (cellBorder (const cse) (ii , b) p )      
        CPoint x -> CPoint x
                    
                
cellFace : Int -> Bool -> Cell -> Cell 
cellFace i b ce = cellBorder ce (i , b)

cellFlip : Int -> Cell -> Cell                  
cellFlip i cl p =
    case cl (pieceFlip i p) of
        CSet n bd ins -> CSet n (borderFlip i bd) (insideNeg i ins) 
        Degen k cse -> if k == i
                       then (Degen k cse)
                       else
                           let ii = (punchOut k i) in
                           Degen k (cellFlip ii (const cse)  p )     
        CPoint x -> CPoint x


borderFlip : Int -> Boundary -> Boundary
borderFlip i bd ( j , b) =
    if (i == j)
    then bd (j , not b)    
    else cellFlip (punchOut j i) (bd (j , b))         

           
-- cutToShps : Cell -> Shps
-- cutToShps = 

mkCubAA : (I.Term , DCtx) -> Result String CubAA
mkCubAA (tm , dc) =
    (     
    let
        dim = dimOfCtx dc

        -- addBoundsToCtx : Dict.Dict Int Bool -> DCtx -> Result String DCtx 
        -- addBoundsToCtx di dcc =
        --     Dict.toList dcc
        --    |>     
            
        mkCase : String -> I.PartialCase -> (Result String (SubFace , CubAA))
        mkCase varN pc =
            (List.foldl
                 (\(tmv , b) -> Result.andThen (\(c , sf) ->
                     toVarAndIndex dc tmv
                   |> Result.fromMaybe ("not in normal form: " ++ (T.t2strNoCtx tmv) )
                   |> Result.andThen ( \(i , DimIndex j) ->
                       mkBound c (i , b)
                    -- Ok c                       
                    |> Result.map (\c2 ->
                                (c2 , Dict.insert j b sf)
                                      )))                               
                     )
                 (Ok (dc , Dict.empty)) (pc.subFace) )
            -- |> Result.map (\x -> let z = (log "sf0" (Tuple.second x) ) in x )
            -- |> Result.andThen (\(dc1 , di) ->
            --                       addBoundsToCtx di dc1
            --                      |> Result.map (\dc2 -> (dc2 , di))  
            --                   )    
            |> Result.map (Tuple.mapSecond ( subFaceFromDict dim
                                           -- >> (\x -> let z = (log "sf" (subFaceLI.toL x) ) in x )
                                           ))    
            |> Result.andThen (\(cc , sf) ->
                       I.absApply (I.notAbs pc.body) (I.ctxVar (getFresh dc))             
                    |> Result.andThen (\bo2 ->              
                      (mkCubAA (
                                bo2 , extendI cc varN))
                    |> Result.map (Tuple.pair sf))               
                              )

        mkSides : I.Term -> Result String  (SubFace -> Maybe CubAA) 
        mkSides ptm =
            I.toHcompCases ptm
           |> Result.fromMaybe "ImposibleError, not proper sides in hcomp"
           |> Result.andThen (\(varN , pcs) -> mapListResult (mkCase varN) pcs)
           |> Result.map (makeFnSubFace)   
    in              
    case tm of
       (I.Def (I.BuildIn I.Hcomp) (_ :: _ :: _ :: sidesE :: botE :: []))
         ->    mkCubAA (I.elimArg botE , dc)
            |> (mkSides (I.elimArg sidesE)
            |> Result.map2 (HcompA) 
               )
       I.Def (I.FromContext i) tl -> Ok (PCubA (dc , i , List.map I.elimArg tl)) 
       _ -> Err "nor hcomp, nor propper definition with tail"            
    ) |> describeErr "mkCubAA"     


---------------
--- structural ops

-- = PCubA x | HcompA (y -> PCubA y x) (PCubA y x)


fixVarIndex : SubFace -> Int -> Int
fixVarIndex sf =
    subFaceLI.toL sf |> List.indexedMap (\j -> Maybe.map (const j))
    |> List.filterMap (identity) |>  List.foldr (\k -> precompose (punchOut k)) identity
    
-- first argument here descirbes dimension of output! (dim of input is n + 1)
pCubABproj : Int -> Face -> CubAB -> CubAB
pCubABproj n f cu =
    let (i , b) = f in
    case (n , cu) of
        (_ , PCubA x)
            -> PCubA (cellBorder x f)
        (_ , HcompA si bot)
            ->
                (si (faceToSubFace (n + 1) f ))
                |> Maybe.map (pCubABproj n (n , True))    
                |> Maybe.withDefault (



                     HcompA
                    (\sf ->
                     let
                         sfD = subFaceDeg i sf
                         i2D = fixVarIndex sfD i 
                         n2 = n + 1 - ((subFaceLI.toL) sf |> List.filterMap identity |> List.length)
                     in    
                     sfD
                     |> si
                     |> Maybe.map (

                                   pCubABproj n2 (i2D , b)

                                        >> Just
                                
                                  )
                     -- Nothing    
                     |> Maybe.withDefault (
                               subFaceInj f sf
                              |> si
                                     
                                          )    
                      )
                    (pCubABproj n f bot)
              )    

-- first argument here descirbes dimension of input! (dim of output is n - 1)              
fillMissing : Int -> CubAB -> CubBB Cell
fillMissing n cab =
    case cab of
        PCubA x -> (PCubB x)
        HcompA si bot
            ->  let fMCenter = (fillMissing n bot) 

                in HcompB
                    
                   (\f ->
                    (si (faceToSubFace n f) |> Maybe.map (fillMissing n))     
                    |> Maybe.withDefault    
                       ((fillMissing (n - 1) (pCubABproj (n - 1) f (HcompA si bot) )))

                    )
                   fMCenter
                       
-- first argument here descirbes dimension of input! (dim of output is n - 1) 
fillMissingA : Int -> CubAB -> CubAB
fillMissingA n cab =
    case cab of
        PCubA x -> (PCubA x)
        HcompA si bot
            ->  let fMCenter = (fillMissing n bot)
                    fMCenterA = (fillMissingA n bot)            
                    misFaces = (\f ->
                         (si (faceToSubFace n f) |> Maybe.map (fillMissingA n))     
                         |> Maybe.withDefault
                                       
                            ((fillMissingA (n - 1) (pCubABproj (n - 1) f (HcompA si bot) )))
                         )
                in HcompA
                    (\sf ->
                        if (getSubFaceCoDim sf == 1) 
                        then (toFace sf |> Maybe.map (misFaces))
                        else si sf 
                       
                         )
                   fMCenterA
                       
pCubMapA : (y -> z) -> PCubA x y -> (PCubA x z)
pCubMapA f pcb = 
    case pcb of
        PCubA x -> x |> f |> PCubA
        HcompA si bot
            ->  pCubMapA f bot
                |> (HcompA ( si  >> Maybe.map (pCubMapA f)  ))
                       
pCubMap : (y -> Result String z) -> PCubA x y -> Result String (PCubA x z)
pCubMap f pca =
    case pca of
        PCubA x -> x |> f |> Result.map PCubA
        HcompA si bot
            ->  pCubMap f bot
                |> Result.map (
                   \bot2 ->
                      HcompA (si >> mapMaybeResult (pCubMap f)) bot2

                       
                                   )
pCubMapB : (y -> z) -> PCubB x y -> (PCubB x z)
pCubMapB f pcb = 
    case pcb of
        PCubB x -> x |> f |> PCubB
        HcompB si bot
            ->  pCubMapB f bot
                |> (HcompB (\x -> (si x) |> pCubMapB f  ))

-- pCubMapBR : (y -> Result String z) -> PCubB x y -> Result String (PCubB x z)
-- pCubMapBR f pcb = 
--     case pcb of
--         PCubB x -> x |> f |> Result.map PCubB
--         HcompB si bot
--             ->  pCubMapB f bot
--                 |> (HcompB (\x -> (si x) |> pCubMapB f  ))                   

pCubMapBFace : (x -> x) -> PCubB x y -> PCubB x y
pCubMapBFace f pcb = 
    case pcb of
        PCubB x -> PCubB x
        HcompB si bot
            ->
                pCubMapBFace f bot
                |> HcompB ( f >>  si >> (pCubMapBFace f)  )

pCubMapASubFace : (x -> x) -> PCubA x y -> PCubA x y
pCubMapASubFace f pcb = 
    case pcb of
        PCubA x -> PCubA x
        HcompA si bot
            ->
                pCubMapASubFace f bot
                |> HcompA ( f >> si >> Maybe.map (pCubMapASubFace f)  )                                      
                   
pCubMap2 : (y -> z) -> (x -> z -> z) -> PCubB x y -> (PCubB x z)
pCubMap2 f g pcb = 
    case pcb of
        PCubB x -> x |> f |> PCubB
        HcompB si bot
            ->  pCubMap2 f g bot
                |> (HcompB (\x -> (si x) |> pCubMap2 f g |> pCubMapB (g x) ))


emptyCtx : DCtx
emptyCtx = {list = [], uniqs = const 0 , bounds = Dict.empty }           

getFresh : DCtx -> Int
getFresh x = List.length x.list
    
nOfDimOfCtx : DCtx -> Int
nOfDimOfCtx dc = List.foldl
           (\(_ , _ , d) -> \k -> 
               case d of
                   Just (Dim) -> k + 1
                   _ -> k
                   )
           0 dc.list
           
dimOfCtx : DCtx -> Int
dimOfCtx dc = (nOfDimOfCtx dc) - (List.length (Dict.keys dc.bounds))
           
mbDim : DCtx -> C.CType -> Maybe Int
mbDim dc (C.CT ty) =
    case ty of
        (I.Def (I.BuildIn I.Interval) []) -> Just (dimOfCtx dc) 
        _ -> Nothing           

lookCSet : DCtx -> Int -> Result String (Maybe CSet)             
lookCSet dc i =  
  lookByIntInList (List.reverse dc.list) i
                              |> Result.fromMaybe ("not in context")
                              |> Result.map (\(_ , _ , x) -> Maybe.map toDSet x)
                              |> Result.map (Maybe.withDefault Nothing)  

-- uniqs not handledwell !!
truncateCtx : Int -> DCtx -> DCtx
truncateCtx i dc =
    {dc | list = dc.list |> (List.reverse >> List.take i >> List.reverse)
      , bounds = Dict.filter ((isLessThan i) >> const ) dc.bounds}                                 

getDimIndex : DCtx -> Int -> Result String DimIndex 
getDimIndex dc i =
    lookByIntInList (List.reverse dc.list) i
         |> Result.fromMaybe ("not in context")
         |> Result.andThen (\(_ , cty , x) ->
                  case cty of
                     C.CT (I.Def (I.BuildIn I.Interval) []) ->
                          Ok ()      
                     _ -> Err "not interval!"       
                            )
        |> Result.map (\() -> DimIndex (dimOfCtx (truncateCtx i dc)) )    
        -- |> Result.map (\(DimIndex x) -> log (String.fromInt x) (DimIndex x) )  


           
toVarAndIndex : DCtx -> I.Term -> Maybe (Int , DimIndex) 
toVarAndIndex dc tm =
    case tm of
        I.Def (I.FromContext i) []
            -> getDimIndex dc i
               |> Result.map (Tuple.pair i)
               |> Result.toMaybe  
        _ -> Nothing
              


              
toCSet : DCtx -> I.Term -> Result String (Maybe CSet)             
toCSet dc tm =  
  case tm of
    I.Def (I.FromContext i) [] -> lookCSet dc i
    _ -> Ok Nothing


toDSet : DData -> Maybe CSet
toDSet dd =
    case dd of
        DSet x -> Just x
        _ -> Nothing


-- pieces manipulation

-- Pieces n == 2^n * n!


-- makeFnPiece ls (Piece _ k) =
--    Dict.get k (Dict.fromList (List.map
--         (\((Piece _ z) , x) ->
--              (z , x)
--         ) ls )) 
--   |> Maybe.withDefault (Nothing , True)
     
         
allPiecesNo : Int -> Int
allPiecesNo n = (factorial n) * (2 ^ n)





                 
-- List.map (corner 4 >> List.map (\x -> if x then  "1" else "0") >> String.join "") (List.range 0 ((2 ^ 4) - 1)) 
       

-- pieceDecode (Piece n i) =                
--    let (p , c) = pieceToPermCorner (Piece n i)
--    in zip (permute n p) (corner n c) 
       
pieceEval : DCtx -> I.Term -> Piece -> I.Term
pieceEval dc tm0 pc =

   let
       (crn , prm) = pc |> (isoPiece |> Tuple.second)
                     


                 -- careful with convention! (i , False) , means that (1 - x_i) , without
                 -- inverting below, nth bool would have meining of oposite side!
       compArr : List (Int , Bool)
       compArr =
           let ca = permuteList prm ( List.indexedMap (Tuple.pair) (subsetLI.toL crn))
                      |> List.map (Tuple.mapSecond not)
           in ca ++ (List.reverse (List.map (Tuple.mapSecond not) ca))
              


       peSortVia : List (Int , Bool) ->  (Int , Bool) -> (Int , Bool) -> Bool
       peSortVia ca (i1 , b1) (i2 , b2) =
           case ca of
               (i , b) :: tl ->
                   case ((i == i1 && b == b1) , (i == i2 && b == b2)) of
                       (True , _) -> True
                       (_ , True) -> False
                       _ -> peSortVia tl (i1 , b1) (i2 , b2)              
               [] -> True
                      
       toDI = Tuple.mapFirst (getDimIndex dc
                 >> Result.map (\(DimIndex x) -> x)
                 >> Result.withDefault (-1))

       peSort : (Int , Bool) -> (Int , Bool) -> Bool
       peSort x y = peSortVia compArr (toDI x) (toDI y)

                     
       peMin : (Int , Bool) -> (Int , Bool) -> (Int , Bool) 
       peMin x y = if peSort x y
                   then x
                   else y    

       peMax : (Int , Bool) -> (Int , Bool) -> (Int , Bool)
       peMax x y = if peSort x y
                   then y
                   else x

       peEnc : (Int , Bool) -> Maybe I.Term
       peEnc (k , b) =
           if b
           then Just (I.Def (I.FromContext k) [])
           else Just (I.Def (I.BuildIn I.Neg) [I.elim (I.Def (I.FromContext k) [])])    
           
       evF : I.Term -> Maybe I.Term
       evF tm =
           case I.tmBIView tm of
               I.JB2 I.Max (I.JT (I.Def (I.FromContext x) [])) (I.JT (I.Def (I.FromContext y) []))
                   -> peMax (x , True) (y , True) |> peEnc
               I.JB2 I.Max (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JT (I.Def (I.FromContext y) []))
                   -> peMax (x , False) (y , True) |> peEnc
               I.JB2 I.Max (I.JT (I.Def (I.FromContext x) [])) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMax (x , True) (y , False) |> peEnc
               I.JB2 I.Max (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMax (x , False) (y , False) |> peEnc
               I.JB2 I.Min (I.JT (I.Def (I.FromContext x) [])) (I.JT (I.Def (I.FromContext y) []))
                   -> peMin (x , True) (y , True) |> peEnc
               I.JB2 I.Min (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JT (I.Def (I.FromContext y) []))
                   -> peMin (x , False) (y , True) |> peEnc
               I.JB2 I.Min (I.JT (I.Def (I.FromContext x) [])) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMin (x , True) (y , False) |> peEnc
               I.JB2 I.Min (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMin (x , False) (y , False) |> peEnc              
               I.JB2 I.Min x y -> evF (I.fromBIView y)
                                  |> Maybe.map (\t2 ->
                                     I.fromBIView (I.JB2 I.Min x (I.JT t2)))
               I.JB2 I.Max x y -> evF (I.fromBIView x)
                                  |> Maybe.map (\t2 ->
                                     Just (I.fromBIView (I.JB2 I.Max (I.JT t2) y)))
                                  |> Maybe.withDefault (
                                      evF (I.fromBIView y)
                                          |> Maybe.map (\t2 ->
                                              I.fromBIView (I.JB2 I.Max x (I.JT t2)))
                                          )
               _ -> Nothing

   in maybeLoop evF tm0 


-- corners

getBoundaryCorner : Subset -> Boundary -> Int
getBoundaryCorner = subsetLI.toL >> getBoundaryCornerL 
                     
getBoundaryCornerL : (List Bool) -> Boundary -> Int
getBoundaryCornerL ss bo =
    case ss of
        x :: xs ->  getBoundaryCornerL xs (cellBorder (bo (0 , x)))
        [] -> case (bo (0 , False) (Piece 0 0 0) ) of
                  CPoint x -> x
                  _ -> -1            
    -- List.head ss |> Maybe.withDefault False |> Tuple.pair 0 |>
    -- bo                        
        
-- inside

inside : Int -> Inside
inside start l =
    case l of
        [] -> -1
        b :: [] -> choose b start (start + 1)      
        b :: ls -> choose b
                         (inside start ls)
                         (inside (start + (2 ^ (List.length ls))) ls)            

            
insideNeg : Int -> Inside -> Inside
insideNeg i = precompose (mapAt i not)


describeErr : String -> Result String x -> Result String x
describeErr s = Result.mapError (\e -> (s ++ " \n" ++ (indent 4 e)) )              




                
--------------
--- Interpreter

type alias Interpreter a = {
          toStr : Int -> a -> String,
          renderCells : Int ->  Cell ->  a,
          -- fillMissing : Int -> CubAC a -> CubBB a,
          collectAll : Int -> CubAC a -> a     
        }

fromNindependent : {
          toStr : a -> String,
          renderCells : Cell ->  a,
          -- fillMissing : CubAC a -> CubBB a,
          collectAll : CubAC a -> a     
        } -> Interpreter a
    
fromNindependent x =
       {
          toStr = const x.toStr,
          renderCells = const x.renderCells ,
          -- fillMissing = const x.fillMissing ,
          collectAll = const x.collectAll     
        }



              
interpretExpr : Interpreter a -> (C.CType , I.Term) -> Result String a
interpretExpr ia = 
   makeDrawCtx >>
   Result.andThen(\x ->
   let n = dimOfCtx (Tuple.second x) in               
      x               
      |> mkCubAA
      |> Result.andThen (pCubMap (transA1 >> Result.map transA2))
      |> Result.map (fillMissingA n)
      |> Result.map (pCubMapA ( ia.renderCells n
                                   ))        
      |> Result.map (ia.collectAll n)
   )
           
