module MicroAgda.RasterInterpreter exposing (..)

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

import MicroAgda.Viz exposing (..)

    
-- type alias Interpreter a = {
--           toStr : a -> String,
--           renderCells : Cell -> Result String a,
--           fillMissing : CubAC a -> CubBB a,
--           transA3 : (a , Bool) -> (a , Bool),          
--           transA3fill : Face -> (a , Bool) -> (a , Bool),
--           collectAll : CubBB a -> a     
--         }


type alias Raster = (Int -> Float) -> Color.Color

-- fillRasterIPR : Interpreter (Raster)
-- fillRasterIPR =
--      let

--            toHcompArg : (Face -> Raster) -> Raster ->
--                          Maybe (Face) -> (Bool , Raster) 
--            toHcompArg si bo =
--                   Maybe.map si
--                >> Maybe.withDefault bo  
--                >> (Tuple.pair True)

--            fillColor = const Color.black
                   
--            fiMi : Int -> CubAC (Raster) -> CubBB (Raster)
--            fiMi n c =
--                case c of
--                    PCubA x -> PCubB (x , False)
--                    HcompA si bo -> 
--                                     HcompB
--                                    (\(j , b) ->
--                                     faceToSubFace n (j , b)
--                                     |> si
--                                     |> Maybe.map (fiMi n)
--                                     |> Maybe.withDefault (PCubB (fillColor , True))
--                                     -- |> pCubMapB
--                                     --     (Tuple.mapFirst (
--                                     --       (sideOrientationFix n (j , b)) ))
--                                     -- |> pCubMapBFace (Tuple.mapFirst (switchVars 0 1))   
--                                    )
--                                    (fiMi n bo)
                   
--            colA : Int -> CubBB (Raster) -> Raster 
--            colA n c =
--                case c of
--                    PCubB (x , _) -> x
--                    HcompB si bo ->
--                        hcomp 2 (toHcompArg (si >> colA n) (colA n bo)) 

--      in
             
--         {
--            toStr = const2 "rasterOK"
--          , renderCells = const2 (Ok (const Color.red)) 
--          , fillMissing = fiMi
--          , collectAll = colA
                      
               
--         }       
    
-- rasterIPR : Interpreter (Raster)
-- rasterIPR =
--      let

--            toHcompArg : (Face -> Raster) -> Raster ->
--                          Maybe (Face) -> (Bool , Raster) 
--            toHcompArg si bo =
--                   Maybe.map si
--                >> Maybe.withDefault bo  
--                >> (Tuple.pair True)

--            fillColor = const Color.black
                   
--            fiMi : Int -> CubAC (Raster) -> CubBB (Raster)
--            fiMi n c =
--                case c of
--                    PCubA x -> PCubB (x , False)
--                    HcompA si bo -> 
--                                     HcompB
--                                    (\(j , b) ->
--                                       faceToSubFace n (j , b)
--                                      |> si
--                                      |> Maybe.map (fiMi n)
--                                      |> Maybe.withDefault (PCubB (fillColor , True))
--                                      |> pCubMapB
--                                         (Tuple.mapFirst (
--                                           (sideOrientationFix n (j , b)) ))
--                                      |> pCubMapBFace (Tuple.mapFirst (switchVars (n - 1) j))     
--                                    )
--                                    (fiMi n bo)
                   
--            colA : Int -> CubBB (Raster) -> Raster 
--            colA n c =
--                case c of
--                    PCubB (x , _) -> x
--                    HcompB si bo ->
--                        hcomp n (toHcompArg (si >> colA n) (colA n bo)) 


--            csr = stripesRasterizer                
                           
--            renderCell : Int -> Cell -> Result String Raster
--            renderCell n cl = composePieces n (cl >> renderCSet csr) |> Ok              


--            --sideTA3 n f = Tuple.mapFirst (sideOrientationFix n f)                   
                                
--      in
       
--         {
--            toStr = const2 "rasterOK"
--          , renderCells = renderCell  
--          , fillMissing = fiMi
--          , collectAll = colA
                      
               
--         }                     




------------- CSet render         

        
colorOfPoint : Int -> Color.Color
colorOfPoint i = if (i >= 0)
                    then (nThColor i)
                    else (Color.white)

type alias CSetRasterizer =  Int -> Boundary -> Inside -> Raster

cornerWiseRastrizer : CSetRasterizer
cornerWiseRastrizer n bnd _ amb =
    let crnr = cornerQ n amb
    in getBoundaryCorner crnr bnd |> colorOfPoint

stripesRasterizer : CSetRasterizer
stripesRasterizer n bnd _ amb =
    
    amb 0 |> stripes |> boolElim
        (getBoundaryCornerL ([False]) bnd)
        (getBoundaryCornerL ([True]) bnd)    
        |> colorOfPoint
    
renderCSet : CSetRasterizer -> CSet -> Raster                
renderCSet csr cs =
    case cs of
        CSet n bd ins -> csr n bd ins
        CPoint i -> const (colorOfPoint i)    
        Degen k x -> punchOutAV k >> (renderCSet csr x)

------------- vars

switchVars : Int -> Int -> Int -> Int
switchVars j k x =
    if (x == j)
    then k
    else (if (x == k)
         then j
         else x)

switchVarsSF : Int -> SubFace -> SubFace -> SubFace
switchVarsSF n sf =
    subFaceLI.toL sf |> List.indexedMap (Tuple.pair >> Maybe.map)
        |> List.filterMap identity |> List.head
        |> Maybe.map (\(j , _ ) -> \sff ->
                 let sfl = subFaceLI.toL sff in         
                 (sfl) |> List.reverse |>
                 List.head |> (Maybe.map (\xx ->
                                    listInsert j xx (List.reverse (List.drop 1 (List.reverse sfl)))
                               ))
                     |> Maybe.withDefault (sfl)          
                     )
        |> Maybe.map (postcompose (subFaceLI.fromL))  
        |> Maybe.withDefault identity

-- n is dimension! not index of var                       
sideOrientationFix : Int -> Face -> ((Int -> y) -> x) -> ((Int -> y) -> x)
sideOrientationFix n (i , b) = precompose2 (switchVars (n - 1) i)

sideOrientationFixF : Int -> Face -> (Int -> y) -> (Int -> y)
sideOrientationFixF n (i , b) = precompose (switchVars (n - 1) i)                               
------------- Float functions




compPar : Float
compPar = 0.3

cornerQL : Int -> (Int -> Float) -> List Bool 
cornerQL n amb =
    case n of
        0 -> []
        _ -> ((amb 0) > 0.5) :: (cornerQL (n - 1) (punchOutAV 0 amb)) 

cornerQ n = cornerQL n >> subsetLI.fromL              
          
sideQ : Float -> Maybe (Float , Bool)
sideQ x = if (x > compPar )
          then (if (x < (1 - compPar) ) then Nothing else (Just ( 1 - x ,  True)))
          else Just (x , False) 

              
sideGet : Int -> (Int -> Float) -> Maybe ((Int , Float) , Bool)              
sideGet n0 amb =
    case n0 of
        0 -> Nothing
        n ->  case (sideQ (amb (n - 1)) , sideGet (n - 1) amb) of
                 (Nothing , x) -> x                                
                 (Just (xN , bN) , Nothing) -> Just (((n - 1) , xN) , bN)
                 (Just (xN , bN) , Just ((i , x) , b)) -> if xN < x
                                                          then Just (((n - 1) , xN) , bN)
                                                          else Just ((i , x) , b)     
                                                              

centerTrans : Float -> Float
centerTrans x = ((x - 0.5) * (1/(1-(compPar * 2)))) + 0.5

centerTransInv : Float -> Float
centerTransInv x = ((x - 0.5) * ((1-(compPar * 2)))) + 0.5                 

centerW : Float
centerW = (1-(compPar * 2))          


interp : Float -> Float -> Float -> Float
interp x0 x1 t = x0 * (1 - t) + (x1 * t)

vertSideFix : Float -> Float
vertSideFix xx =
    let cp = compPar
        x = xx * cp            
        h = ( (1 - 2 * cp) / (2 * cp) )
        z = ((1 / ((0.5 - cp + x) * 2)) - 1) * h     
    in ( 1 - z )

        
sideTrans : (Int , Bool) -> Bool -> ( (Int -> Float)) -> (Int -> Float)
sideTrans (i , b) sk f k =
    let
        q = f i
        z = (if b
            then (1 - ( (1 - (q)) * (1 / compPar))) 
            else (1 - ((q) * (1 / compPar))))                 
    in             
    if (k == i)
    then (vertSideFix z)
    else
      ( if sk
        then (((f k) - 0.5) * (1 / (interp ( centerW) 1 z ))) + 0.5
        else (((f k) - 0.5)) + 0.5 )

hhh = ( (1 - 2 * compPar) / (2 * compPar) )

tanAlpha = 0.5 / ( 1 + hhh)
      
vertSideFixInv : Float -> Float
vertSideFixInv y =

    
    let cp = compPar
        uu = hhh * y * tanAlpha
        dd = hhh + 1 - y
    in         
    ((uu / dd) * (1 / cp))         


        
sideTransInv : (Int , Bool) -> Bool -> ( (Int -> Float)) -> (Int -> Float)
sideTransInv (i , b) sk f k =
    let
        q = f i
        zz = ( vertSideFixInv q )    
        qq = compPar * (negF ( zz ))    
        z = (if b
             then (1 - qq)
             else qq)    
    in             
    if (k == i)
    then (z) 
    else
      ( if sk
        then (((f k) - 0.5) / (1 / (interp ( centerW) 1 zz ))) + 0.5
        else (((f k) - 0.5)) + 0.5 )          
          
hcomp : Int -> ((Maybe (Int , Bool)) -> (Bool , (Int -> Float) -> x)) -> (Int -> Float) -> x
hcomp n sides amb =
    sideGet n (amb)  
    |> Maybe.map (\((i , f) , b) ->
                       case (sides (Just (i , b))) of
                          (sk , ff) -> ff (sideTrans (i , b) sk amb)                      
                 )
    |> Maybe.withDefault ((sides Nothing |> Tuple.second) (amb >> centerTrans))   


                
getPiece : Int -> (Int -> Float) -> Piece
getPiece n amb =
    List.map (amb >> peak) (range n) |> sortPerm |> invPermutation
    |> Tuple.pair (subsetLI.fromL (List.map (amb >> isLessThan 0.5) (range n)))
    |> Tuple.first isoPiece   
        
           
composePieces : Int -> (Piece -> Raster) -> Raster         
composePieces n cl = funStich (getPiece n) cl

     -- >> 

         
modF : Float -> Float
modF x = x - (toFloat (floor x)) 

nThColor : Int -> Color.Color    
nThColor x = Color.hsl (modF ((3/16) * (toFloat x)))  1.0 0.5
                     

negF : Float -> Float
negF x = 1 - x

peak : Float -> Float
peak x = min x (negF x)        

stripesN = 3
         
stripes : Float -> Bool
stripes xx =
    let x = (xx - 0.5)
    in (((sin (stripesN * 6.4 * x)) + (2)*x) > 0)     

         
----- Ambient Vars
punchInAV : Int -> x -> (Int -> x) -> (Int -> x)
punchInAV k x f i =
    if i == k
    then x
    else (if i<k
          then f i
          else f (i - 1)
         )

punchOutAV : Int -> (Int -> x) -> (Int -> x)
punchOutAV k f i =
    (if i < k
     then f i
     else (f (i + 1)))           
         



-- nThColor : Int -> z -> Color.Color    
-- nThColor x = \_ -> Color.hsl (modF((2/16) * (toFloat x)))  1.0 0.5
        
-- nThColorB : Int -> Bool -> z -> Color.Color    
-- nThColorB x b = \_ -> Color.hsl (modF((1/16) * (toFloat x)))  0.8 (if b then 0.3 else 0.8)  


-- circleH : z -> z -> (Float -> Float -> z)
-- circleH c1 c2 x0 y0 = let x = (x0 - 0.25) 
--                           y = (y0 - 0.25) in
--                       if (x*x + y*y > 0.2) then c1 else  c2

                
    
-- generate : DrawCtx -> C.CType -> Maybe (VData)
-- generate dc ct =
--     let k = List.length dc in
--     (    
--        case (I.tmBIView (C.toTm ct) , arity ct) of
--            ((I.JB4 I.PathP _ _ (I.JT (I.Def (I.FromContext x0) [])) (I.JT (I.Def (I.FromContext x1) []))) , _) ->
--             Just (Cub1 (\i -> choose (stripes i) (nThColor x0) (nThColor x1)))
--            (_ , Just 0) -> Just (Cub0 (nThColor k))
--            --(_ , Just 1) -> Just (Cub1 (\i0 -> nThColorB k (stripes i0)))
--            (_ , Just 2) -> Just (Cub2 (circleH (nThColorB k True) (nThColorB k False)))
--            _ -> Nothing 
--     )
--     |> Maybe.map Just
--     |> Maybe.withDefault (mbDim dc ct |> Maybe.map (\i -> Dim (Just i) (\x -> x i) ))           
                          
    


       
-- e2fun : DrawCtx -> I.Term -> Result String (VData)         
-- e2fun dc tm = 
--     case tm of
--         I.Var _ _ -> Err "met abstracted variable in viz"
--         (I.Def (I.FromContext i) []) -> (dcLook dc i)
--         (I.Def (I.FromContext i) (x :: [])) -> dcApp (dcLook dc i) (e2fun dc (I.elimArg x))
--         (I.Def (I.FromContext i) (x1 :: x2 :: [])) ->
--             dcApp (dcApp (dcLook dc i) (e2fun dc (I.elimArg x1))) (e2fun dc (I.elimArg x2))
--         (I.Def (I.BuildIn I.Max) (x1 :: x2 :: [])) ->
--             dcMax (e2fun dc (I.elimArg x1)) (e2fun dc (I.elimArg x2))
--         (I.Def (I.BuildIn I.Min) (x1 :: x2 :: [])) ->
--             dcMin (e2fun dc (I.elimArg x1)) (e2fun dc (I.elimArg x2))
--         (I.Def (I.BuildIn I.Neg) (x1 :: [])) ->
--             dcNeg (e2fun dc (I.elimArg x1))
--         (I.Def (I.BuildIn I.Hcomp) (_ :: _ :: _ :: sidesE :: botE :: [])) ->
--            dcHcomp dc (I.elimArg sidesE) (I.elimArg botE)       
--         (I.Def (I.BuildIn I.I0) ([])) -> Ok (Dim Nothing (\_ -> 0))
--         (I.Def (I.BuildIn I.I1) ([])) -> Ok (Dim Nothing (\_ -> 1))                                 
--         _ -> Err ("unable to viz \n\n" ++ (T.t2strNoCtx (tm)) ++ "\n\n\n")



             
        --sides (0 , True) (amb >> (\x -> x *2))


-- sideEDecon : DrawCtx -> I.PartialCase
--            -> Result String
--               ( ((Int , Bool) , ((Int -> Float) -> Color.Color)))
-- sideEDecon dc { subFace , body} =
--     case subFace of
--         (I.Def (I.FromContext i) [] , b) :: [] ->
--           case (dcLook dc i) of
--               Ok (Dim (Just m) _) -> 
--                          hijack dc i
--                          |> (Result.andThen (\(dch) ->
--                                  I.absApplyOnTm body (I.Def (I.FromContext ( List.length dc )) [])
--                                 |> Result.andThen (\bo -> e2fun dch bo
--                                   |> Result.andThen
--                                        (toCub0 >>
--                                             Result.fromMaybe "Viz : Imposible in sideEDecon 2" )   )
--                                 |> Result.map (\f -> ((m , b) , f)  )                 
--                                            ))
--               _ -> Err "VIZ : Imposible! in sideEDecon"               
--         _ -> Err "only simple face implemented now (VIZ, sideEDecon)"

-- collectSidesE : List ((Int , Bool) , x)
--                   -> ((Int , Bool) -> Maybe x)
                 
-- collectSidesE =
--     List.foldl
--         (\((i , b) ,  x) -> \f -> \(i2 , b2) ->
--             if (i == i2) && (b == b2)
--             then Just x
--             else f (i2 , b2)    
--          ) (\_ -> Nothing)


            

    
-- sidesEDecon : DrawCtx -> I.Term
--             -> Result String
--                ((Int , Bool) -> Maybe ((Int -> Float) -> Color.Color))
-- sidesEDecon dc ltm =
--     toHcompCases ltm
--    |> Maybe.map (\pcs ->     
--                    mapListResult (sideEDecon dc)
--                         (List.filter (\l -> (List.length (l.subFace)) < 2) pcs)     
--                   |> Result.map collectSidesE     
--                )    
--    |> Maybe.withDefault (Err "fatal VIZ err not lambda in dcHcomp")


-- eqDictsIB : (Dict.Dict Int Bool) -> (Dict.Dict Int Bool) -> Bool
-- eqDictsIB d1 d2 =
--     let ff = \d -> Dict.filter (\i -> \b ->
--                   Maybe.withDefault (True) (Dict.get i d |> Maybe.map (\bb -> not (bb == b))))
--               >> Dict.isEmpty
--     in  ((ff d1 d2) && (ff d2 d1))
        
-- collectSidesPre : List ((Dict.Dict Int Bool) , x)
--                   -> ((Dict.Dict Int Bool) -> Maybe x)
                 
-- collectSidesPre = 
--     List.foldl
--         (\(d1 ,  x) -> \f -> \(d2) ->
--             if eqDictsIB d1 d2
--             then Just x
--             else f d2    
--          ) (\_ -> Nothing)


-- sideEDeconPre : DrawCtx -> I.PartialCase
--            -> Result String
--               ( ((Dict.Dict Int Bool) , ((Int -> Float) -> Color.Color)))
-- sideEDeconPre dc0 { subFace , body} =

--     let f : (I.Term , Bool) ->  Result String (DrawCtx , I.Term , List (Int , Bool))
--                    -> Result String (DrawCtx , I.Term , List (Int , Bool))
--         f = \(ft , b) -> Result.andThen (\(dc , bd , fl) ->
--              case ft of
--                  I.Def (I.FromContext i) [] ->
--                    case (dcLook dc i) of
--                        Ok (Dim (Just m) _) ->                          
--                                hijack dc i
--                               |> Result.andThen (\dc2 ->
--                                     I.absApplyOnTm bd (I.Def (I.FromContext ( List.length dc )) [])
--                                    |> Result.map (\x -> (dc2 , x , (m , b) :: fl))                  
--                                                        )
--                        _ -> Err "imposible (sideEDeconPre-fold)"
--                  _ -> Err "imposible (sideEDeconPre-fold)"                            
--              )        
--     in        
--     List.foldl f (Ok (dc0 , body , [])) subFace    
--     |> Result.andThen (\(dc , bd , fcs) ->
--         e2fun dc bd
--        |> Result.andThen
--         (toCub0 >>
--              Result.fromMaybe "Viz : Imposible in sideEDecon 2" )                     
--        |> Result.map (\ff -> (Dict.fromList fcs , ff))                
--                   )
    
                  
-- sidesEDeconPre : DrawCtx -> I.Term
--             -> Result String
--                ((Dict.Dict Int Bool) -> Maybe ((Int -> Float) -> Color.Color))
-- sidesEDeconPre dc ltm = 
--     toHcompCases ltm
--    |> Maybe.map (\pcs ->
--                    pcs   
--                   |> mapListResult (sideEDeconPre dc)                             
--                   |> Result.map collectSidesPre     
--                )    
--    |> Maybe.withDefault (Err "fatal VIZ err not lambda in dcHcomp")


-- allFaces : Int -> List (Int , Bool)
-- allFaces n =
--     List.range 0 (n - 1)
--    |> List.map (\i -> [(i , True),(i , False) ])
--    |> List.concat          




       
-- punchInDict : Int -> Dict.Dict Int Bool -> Dict.Dict Int Bool
-- punchInDict k =
--     Dict.toList
--    >> List.map (\(i , bb) ->
--          if i >= k
--          then (i + 1 , bb)           
--          else (i , bb))
--    >> Dict.fromList                    
        

-- boolToFloat : Bool -> Float                       
-- boolToFloat b =
--     if b then 1 else 0

    
-- getSide : Int -> (Int , Bool ) -> 
--                (((Int -> Float) -> Color.Color) ,
--                 ((Dict.Dict Int Bool) -> Maybe ((Int -> Float) -> Color.Color)))
--               ->
--                 (((Int -> Float) -> Color.Color) ,
--                 ((Dict.Dict Int Bool) -> Maybe ((Int -> Float) -> Color.Color)))
-- getSide nn (i , b) (botD , dmc)  =
--     case nn of
--         0 -> (botD , dmc)
--         n -> ((punchIn i (boolToFloat b) >> botD) ,
--                (punchInDict i) >> (\x ->                       
--                x
--               |> dmc
--               |> Maybe.map (comp (punchIn i (boolToFloat b)) )
--               |> maybeTry (
                           
--                      x |> Dict.insert i  b |> dmc
--                      -- |> Maybe.map (comp (punchIn i (boolToFloat b)))    
--                      -- |> Maybe.map (\_ -> (\_ -> (Color.red)) ) 
--                           )      
--              ))


               
-- fillMissingH : Int -> (((Int -> Float) -> Color.Color) ,
--                 ((Dict.Dict Int Bool) -> Maybe ((Int -> Float) -> Color.Color)))
--                  -> (Int , Bool)
--                  -> Result String
--                      ((Int , Bool) , (Bool , ((Int -> Float) -> Color.Color)))
-- fillMissingH n (botF , dmc) (i , b) =
--         dmc (Dict.fromList [( i , b)])
--         |> Maybe.map ((Tuple.pair True) >> Ok)    
--         |> Maybe.withDefault (
--                getSide n (i , b) ( botF , dmc)
--              |> fillMissing (n - 1)
--              |> Result.map (hcomp (n - 1))
--              |> Result.map (comp (punchOut i) )
--              -- |> Result.map (\_ -> (\_ -> (Color.black)) )      
--              |> Result.map (Tuple.pair False)     
--            )                
--         |> Result.map (Tuple.pair (i , b) )        
      

-- fillMissing : Int -> (((Int -> Float) -> Color.Color)
--               , ((Dict.Dict Int Bool) -> Maybe ((Int -> Float) -> Color.Color)))
--               -> Result String ((Maybe (Int , Bool)) -> (Bool , ((Int -> Float) -> Color.Color)))
-- fillMissing n (botF , dmc) =  
--       allFaces n
--    |> mapListResult ((fillMissingH n (botF , dmc)) )
--    |> Result.map (             
--         List.partition (Tuple.first >> Tuple.second)
--         >> mapSame (List.map (\((x , _) , y) -> (x , y)))
--         >> mapSame Dict.fromList
--         >> (\(lT , lF) -> \(i , b) -> 
--                 (Dict.get i (if b then lT else lF))
--                 |> Maybe.withDefault (True , (\_ -> (Color.gray)))
--            ))
--    |> Result.map (
--          \ff ->
--              (Maybe.map ff)
--              >> (Maybe.withDefault (True , botF))
--                  )   


       


    
                    
