module MicroAgda.Drawing exposing (..)


import Color exposing (..)

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict

import Canvas exposing (..)
import Canvas.Settings exposing (..)

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

pointR = 3    

toShape : List (Seg) -> Maybe Shape
toShape l =
    case l of
        [Pt x , Pt y] -> Just (circle (x , y) pointR)
        [Seg x0 x1 , Seg y0 y1] -> Just (rect ( x0 , y0 ) ( x1 - x0) (y1 - y0) )
        [Seg x0 x1 , Pt y] -> Just (path ( x0 , y ) [ lineTo ( x1 , y ) ])
        [Pt x , Seg y0 y1] -> Just (path ( x , y0 ) [ lineTo ( x , y1 ) ])     
        _ -> Nothing             
    
toRenderable : (a -> Color) -> Shp a -> Maybe Renderable
toRenderable colFn ( (n , l) , a ) =
    (case l of
        [ [x] , [y] ] ->  Just (circle (x , y) pointR)
        [ [x0 , y0] , [x1 , y1] ] -> Just (path ( x0 , y0 ) [ lineTo ( x1 , y1 ) ])
        [ [x0 , y0] , [x1 , y1] ,  [x2 , y2] ,  [x3 , y3] ]
             -> Just (path ( x0 , y0 ) [ lineTo ( x1 , y1 )
                                       , lineTo ( x3 , y3 )
                                       , lineTo ( x2 , y2 ) ])
        _ -> Nothing   
    )    
    |> Maybe.map (
                  List.singleton
                  >> ( if n == 1
                       then shapes [ stroke Color.black ] --(colFn a) ]
                       else shapes [ fill (colFn a)  ]   
                     )) 
               
toRenderableAll : (a -> Color) -> Drawing a -> List Renderable    
toRenderableAll colFn = List.filterMap (toRenderable colFn)     



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
                  
-- shpSplitIso : Iso (List (Seg)) (List ((Float , Float) , Bool)      
-- shpSplitIso =
