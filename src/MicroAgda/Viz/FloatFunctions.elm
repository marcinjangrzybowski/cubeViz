module MicroAgda.Viz.FloatFunctions exposing (..)

import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T

import MicroAgda.Drawing exposing  (..)

import MicroAgda.StringTools exposing (..)

import Color

import ResultExtra exposing (..)

import Either exposing (leftToMaybe)

import Debug exposing (..)

import Dict

import Set

import Combinatorics exposing (..)

import  MicroAgda.Viz.Structures exposing (..)
import  MicroAgda.Viz.PiecesEval exposing (..)
import  MicroAgda.Viz.Remap exposing (..)


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


defaultCompPar : Float
defaultCompPar = 0.3

cornerQL : Int -> (Int -> Float) -> List Bool 
cornerQL n amb =
    case n of
        0 -> []
        _ -> ((amb 0) > 0.5) :: (cornerQL (n - 1) (punchOutAV 0 amb)) 

cornerQ n = cornerQL n >> subsetLI.fromL              
          
sideQ : Float -> Float -> Maybe (Float , Bool)
sideQ compPar x = if (x > compPar )
          then (if (x < (1 - compPar) ) then Nothing else (Just ( 1 - x ,  True)))
          else Just (x , False) 

              
sideGet : Float -> Int -> (Int -> Float) -> Maybe ((Int , Float) , Bool)              
sideGet compPar n0 amb =
    case n0 of
        0 -> Nothing
        n ->  case (sideQ compPar (amb (n - 1)) , sideGet compPar (n - 1) amb) of
                 (Nothing , x) -> x                                
                 (Just (xN , bN) , Nothing) -> Just (((n - 1) , xN) , bN)
                 (Just (xN , bN) , Just ((i , x) , b)) -> if xN < x
                                                          then Just (((n - 1) , xN) , bN)
                                                          else Just ((i , x) , b)     
                                                              

centerTrans : Float -> Float -> Float
centerTrans compPar x = ((x - 0.5) * (1/(1-(compPar * 2)))) + 0.5

centerTransInv : Float -> Float -> Float
centerTransInv compPar x = ((x - 0.5) * ((1-(compPar * 2)))) + 0.5                 

centerW : Float -> Float
centerW compPar = (1-(compPar * 2))          




vertSideFix : Float -> Float -> Float
vertSideFix compPar xx =
    let cp = compPar
        x = xx * cp            
        h = ( (1 - 2 * cp) / (2 * cp) )
        z = ((1 / ((0.5 - cp + x) * 2)) - 1) * h     
    in ( 1 - z )

        
sideTrans : Float -> (Int , Bool) -> Bool -> ( (Int -> Float)) -> (Int -> Float)
sideTrans compPar (i , b) sk f k =
    let
        q = f i
        z = (if b
            then (1 - ( (1 - (q)) * (1 / compPar))) 
            else (1 - ((q) * (1 / compPar))))                 
    in             
    if (k == i)
    then (vertSideFix compPar z)
    else
      ( if sk
        then (((f k) - 0.5) * (1 / (interp ( centerW compPar) 1 z ))) + 0.5
        else (((f k) - 0.5)) + 0.5 )

hhh compPar = ( (1 - 2 * compPar) / (2 * compPar) )

tanAlpha compPar = 0.5 / ( 1 + (hhh compPar))
      
vertSideFixInv : Float -> Float -> Float
vertSideFixInv compPar y =

    
    let cp = compPar
        uu = (hhh cp) * y * (tanAlpha cp)
        dd = (hhh cp) + 1 - y
    in         
    ((uu / dd) * (1 / cp))         



actOnArr : ( (Int -> Float) -> (Int -> Float)) -> List Float -> List Float
actOnArr f l =
    (f (lookByIntInList l >> Maybe.withDefault 0) >> const)  
    |> swapFn List.indexedMap l 
       
sideTransInv : Float -> (Int , Bool) -> Bool -> ( (Int -> Float)) -> (Int -> Float)
sideTransInv compPar (i , b) sk f k =
    let
        q = f i
        zz = ( vertSideFixInv compPar q )    
        qq = compPar * (negF ( zz ))    
        z = (if b
             then (1 - qq)
             else qq)    
    in             
    if (k == i)
    then (z) 
    else
      ( if sk
        then (((f k) - 0.5) / (1 / (interp ( centerW compPar) 1 zz ))) + 0.5
        else (((f k) - 0.5)) + 0.5 )          
          
hcomp : Float -> Int -> ((Maybe (Int , Bool)) -> (Bool , (Int -> Float) -> x)) -> (Int -> Float) -> x
hcomp compPar n sides amb =
    sideGet compPar n (amb)  
    |> Maybe.map (\((i , f) , b) ->
                       case (sides (Just (i , b))) of
                          (sk , ff) -> ff (sideTrans compPar (i , b) sk amb)                      
                 )
    |> Maybe.withDefault ((sides Nothing |> Tuple.second) (amb >> (centerTrans compPar)))   


                
getPiece : Int -> (Int -> Float) -> Piece
getPiece n amb =
    List.map (amb >> peak) (range n) |> sortPerm |> invPermutation
    |> Tuple.pair (subsetLI.fromL (List.map (amb >> isLessThan 0.5) (range n)))
    |> Tuple.first isoPiece   
        
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
         
             
degenDrawingMissingSide : Float -> Int -> Face -> Drawing MetaColor -> Drawing MetaColor
degenDrawingMissingSide compPar n (k , b) =
    List.map
        (\( ( m , pl ) , mc ) ->
             ((case mc of
                 Nothing ->
                   let efFlat = (const 1)  
                       efPiram =  piramFn compPar n
                            -- >> negF >> (\x -> x * 1.0 ) >> negF
                            -- hint : place tu animate of filling missing sides     
                   in  fillPrll k
                       (embedPrll k (efFlat ) (m , pl))
                       (embedPrll k (efPiram) (m , pl))
                 Just x -> fillPrll k
                       (embedPrll k (const 0) (m , pl))  (embedPrll k (const 1) (m , pl))
               ) 
             , mc )
        )

piramFn : Float -> Int -> List Float -> Float 
piramFn compPar n lf = 
    sideGet compPar n (lookByIntInList lf >> Maybe.withDefault 0)
    |> Maybe.map (Tuple.first >> Tuple.second
                      >> (\x -> x / compPar)
                      >> negF >> vertSideFix compPar
                 )
    |> Maybe.withDefault (0)

