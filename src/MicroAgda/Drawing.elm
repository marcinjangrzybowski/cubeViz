module MicroAgda.Drawing exposing (..)


import Color exposing (..)

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict

import Canvas exposing (..)
import Canvas.Settings exposing (..)
import Canvas.Settings.Line exposing (..)
import Canvas.Settings.Advanced exposing (..)

import Combinatorics exposing (..)

import ResultExtra exposing (..)

-- import Either exposing (..)

type alias NPoint = List Float

type Seg = Pt Float | Seg Float Float

type alias Prll = (Int , (List (List Float)))       
                    -- Int=k means number means dimension of paraelogram (not ambient space!)
                    -- length of list on first level is eequal to 2 ^ k
                    -- dimension of ambient space must by consistent with context it is equal to length of lists on second level 
                    
type alias Shp a = (Prll , a)
    
type alias Drawing a = List (Shp a)

type alias DStyle = (Color.Color , List Setting )
    
type alias MetaColor = Maybe (Bool , DStyle )
    
pointR = 1    

toShape : List (Seg) -> Maybe Shape
toShape l =
    case l of
        [Pt x , Pt y] -> Just (circle (x , y) pointR)
        [Seg x0 x1 , Seg y0 y1] -> Just (rect ( x0 , y0 ) ( x1 - x0) (y1 - y0) )
        [Seg x0 x1 , Pt y] -> Just (path ( x0 , y ) [ lineTo ( x1 , y ) ])
        [Pt x , Seg y0 y1] -> Just (path ( x , y0 ) [ lineTo ( x , y1 ) ])     
        _ -> Nothing             
    
toRenderable : Shp MetaColor -> Maybe (Renderable , Int)
toRenderable ( (n , l) , a ) =
    (case l of
        [ [x , y] ] ->  Just ((circle (x , y) pointR , 0))
        [ [x0 , y0] , [x1 , y1] ] -> Just ((path ( x0 , y0 ) [ lineTo ( x1 , y1 ) ]) , 1)
        [ [x0 , y0] , [x1 , y1] ,  [x2 , y2] ,  [x3 , y3] ]
             -> Just ((path ( x0 , y0 ) [ lineTo ( x1 , y1 )
                                       , lineTo ( x3 , y3 )
                                       , lineTo ( x2 , y2 ) ]), 2)
        _ ->
             -- let ww = log ("wrong dim draw: " ++ (String.fromInt n)) (l , a) in
             Nothing   
    )    
    |> Maybe.map (Tuple.mapFirst (
                  List.singleton
                  >> (
                      let op = choose (n == 1) fill stroke
                      in
                         a |> Maybe.map (\(b , c) ->
                                        List.append [compositeOperationMode
                                           (choose b
                                            SourceOver DestinationOver)
                                         , c |> Tuple.first |> op ]
                                            (c |> Tuple.second)
                                      ) 
                         |> Maybe.withDefault ([compositeOperationMode DestinationOut
                                                , op Color.black])
                         |> (List.append [lineWidth 1 ]) 
                         |> shapes


                       -- if n == 1
                       -- then shapes [ stroke Color.black ] --(colFn a) ]
                       -- else shapes [ fill (colFn a)  ]   
                     )
                 )) 
               
toRenderableAll : Drawing MetaColor -> List Renderable    
toRenderableAll l =
    let allR = List.filterMap (toRenderable) l in
    List.concat [(List.filter (Tuple.second >> isEqual 2) allR)      
                ,(List.filter (Tuple.second >> isEqual 1) allR)
                ,(List.filter (Tuple.second >> isEqual 0) allR)]    
    |> List.map (Tuple.first)                


mapDrawingData : (a -> b) -> Drawing a -> Drawing b
mapDrawingData f = List.map (Tuple.mapSecond f)

                

monoColorize : (Color) -> Drawing a -> Drawing Color                   
monoColorize = const >> mapDrawingData                   

mapCoords : ((Int -> Float) -> (Int -> Float)) -> Drawing a -> Drawing a
mapCoords f = 
      List.map ( ambFnOnArr f)     
    |> Tuple.mapSecond
    |> Tuple.mapFirst
    |> List.map   
                 
mapCoordsAsL : (List (Float) -> List (Float)) -> Drawing a -> Drawing a
mapCoordsAsL f = 
      List.map ( f)     
    |> Tuple.mapSecond
    |> Tuple.mapFirst
    |> List.map          
           
pxScale : (Int , Int) -> Drawing a -> Drawing a
pxScale (w , h) =
    List.map (Tuple.mapFirst (Tuple.mapSecond ( List.map ( 
               \(l) ->
                   case l of
                       [x , y] -> [x * (toFloat w) , y * (toFloat h)]
                       _ -> l
                              ))))
-- shapes [ fill (color) ]
--                                             [ rect (x * w , y * h) (w / frs) (h / frs) ]


segSplitIso : Iso (Seg) ((Float , Float) , Bool)      
segSplitIso =
    ((\x -> case x of                     
             Pt p -> ((p , p ) , False)
             Seg p0 p1 -> ((p0 , p1 ) , True)) 
      ,
     ( \((pA , pB) , b) -> if b
                           then (Seg pA pB)
                           else (Pt pA)    )
    )


combineDrawings : List (Drawing a) -> Drawing a
combineDrawings = List.concat


                  
combineDrawingsSafe : List (Drawing a) -> Result String (Drawing a)
combineDrawingsSafe = combineDrawings >>
         (\l ->
              if (l |> List.map (Tuple.first >> prllDim) |> allSame)
              then (Ok l)
              else (Err "cannot combine drawings of diferent dimensions")
         )
                  
-- shpSplitIso : Iso (List (Seg)) (List ((Float , Float) , Bool)      
-- shpSplitIso =

embedPrll: Int -> (List (Float) -> Float) -> Prll -> Prll
embedPrll k f = Tuple.mapSecond (List.map (\l -> listInsert k (f l) l))
    
embed : Int -> (List (Float) -> Float) -> Drawing a -> Drawing a
embed k f = mapCoordsAsL (\l -> listInsert k (f l) l)  

ptZero : Prll
ptZero = (0 , [[]] )
         
segOne : Prll
segOne =  (1 , [[0] , [1]] )
         
unitHyCube : Int -> Prll
unitHyCube =
    (iter ( (\(k , x)  -> (k + 1
                  , List.concat [
                         (List.map (listInsert 0 0.0) x)
                       , (List.map (listInsert 0 1.0) x)
                      ]))) ptZero)                


-- it not changes dim of ambient space!        
sidePrll : Bool -> Prll -> Prll
sidePrll b (n , l) =
    if n == 0
    then ptZero
    else ( (n - 1)  , (choose b List.take List.drop) ( 2 ^ (n - 1)) l
            )      

-- it not changes dim of ambient space!
fillPrll : Int -> Prll -> Prll -> Prll
fillPrll k (n , p) = fillPrllUS (min k n) (n , p)

fillPrllUS : Int -> Prll -> Prll -> Prll
fillPrllUS k =
    case k of
           0 -> \(n , l1) -> \(_ , l2) ->
                (n + 1 , List.append l1 l2)
           _  -> (\p0 -> \p1 -> 
               fillPrll 0
               (fillPrll (k - 1) (sidePrll False p0) (sidePrll False p1)) 
               (fillPrll (k - 1) (sidePrll True p0) (sidePrll True p1))
               )       
    
-- 

-- it not changes dim of ambient space!        
facePrll : Face -> Prll -> Prll                 
facePrll (i , b) =
    case i of
        0 -> sidePrll b
        _ -> (\x -> fillPrll 0
             (facePrll (i - 1 , b) (sidePrll False x) )
             (facePrll (i - 1 , b) (sidePrll True x) )
             )    
-- subPrll : SubFace -> Prll -> Prll         

prllDim : Prll -> Int
prllDim = Tuple.second >> List.head >> Maybe.map (List.length) >> Maybe.withDefault 0

getDrawingDim : Drawing a -> Maybe Int
getDrawingDim = List.head >> Maybe.map (Tuple.first >> prllDim) 
                
drawFaces : Prll -> (Face -> a) -> Drawing a 
drawFaces prl f = pairFrom ((swap facePrll) prl)  f
                  |> (tabulateFaces (prllDim prl))
                  |> List.map (Tuple.second)

degenDrawing : Int -> Drawing a -> Drawing a
degenDrawing k = List.map
    (Tuple.mapFirst             
    (\x -> fillPrll k
       (embedPrll k (const 0) x)
       (embedPrll k (const 1) x) 
    ))                       

emptyDrawing : Drawing a    
emptyDrawing = []    
    
stripesFromList : (a , a) -> List Float -> Drawing a
stripesFromList (a0, a1) =
    listTuples
    >> List.indexedMap (\i -> \(xA , xB) -> ((1 , [[xA] , [xB]]) , choose (oddQ i) a0 a1))  

fromLSeg : List Seg -> Prll
fromLSeg = List.foldr (\s ->
              case s of
                  Pt x -> embedPrll 0 (const x)
                  Seg x y -> \z -> fillPrll 0
                           (embedPrll 0 (const x) z)
                           (embedPrll 0 (const y) z)
              ) ptZero             

spanPrll : Int -> Float -> Float -> Prll
spanPrll n x0 x1 = List.repeat n (Seg x0 x1) |> fromLSeg 

segmentsRange : Int -> Float -> Float -> List (Float,Float)
segmentsRange n x0 xN =
    List.range 0 n  
    |> List.map (\k -> interp x0 xN ((toFloat k) / (toFloat n)))
    |> listTuples
                     
unmasked : Drawing DStyle -> Drawing MetaColor
unmasked = mapDrawingData (Tuple.pair False >> Just)           

masked : Drawing a -> Drawing (DStyle) -> Drawing MetaColor
masked m x =
      -- case getDrawingDim m of
      --     Just 1 -> unmasked x
      --     _ -> 
             List.append
             (mapDrawingData (const Nothing) m)
             (mapDrawingData (Tuple.pair True >> Just) x)                     

setLightness : Float -> Color -> Color
setLightness lV = toHsla >> (\x -> {x | lightness = lV }) >> fromHsla

setSaturation : Float -> Color -> Color
setSaturation lV = toHsla >> (\x -> {x | saturation = lV }) >> fromHsla                            

mapColor : (Color -> Color) -> Drawing MetaColor -> Drawing MetaColor
mapColor = Tuple.mapFirst >> Tuple.mapSecond >>  Maybe.map >> mapDrawingData            


translate : List (Float) -> Drawing a -> Drawing a
translate vec =
    mapCoordsAsL (\cl -> zip (cl , vec) |> List.map (\(x , delta)-> x + delta ))

scale : Float -> Drawing a -> Drawing a
scale factor = mapCoordsAsL (List.map (\x-> x * factor ))        
