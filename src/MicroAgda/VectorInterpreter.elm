module MicroAgda.VectorInterpreter exposing (..)

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

import MicroAgda.RasterInterpreter exposing (..)
    
-- type alias Interpreter a = {
--           toStr : a -> String,
--           renderCells : Cell -> Result String a,
--           fillMissing : CubAC a -> CubBB a,
--           transA3 : (a , Bool) -> (a , Bool),          
--           transA3fill : Face -> (a , Bool) -> (a , Bool),
--           collectAll : CubBB a -> a     
--         }



    
vCellOutlineIPR : Interpreter (Drawing ())
vCellOutlineIPR =
     let


           -- fillColor = const Color.black
                   
           fiMi : Int -> CubAC (Drawing ()) -> CubBB (Drawing ())
           fiMi n c =
                case c of
                   PCubA x -> PCubB (x , False)
                   HcompA si bo -> 
                                    HcompB
                                   (\(j , b) ->
                                    faceToSubFace n (j , b)
                                    |> si
                                    |> Maybe.map (fiMi n)
                                    |> Maybe.withDefault (PCubB ([] , True))
                                    |> pCubMapB
                                        (Tuple.mapFirst (
                                          (mapCoords (sideOrientationFixF n (j , b))) ))
                                     |> pCubMapBFace (Tuple.mapFirst (switchVars (n - 1) j)) 
                                   )
                                   (fiMi n bo)


                                       

                                       
           colA : Int -> CubBB (Drawing ()) -> Drawing () 
           colA n c = 
               case c of
                   PCubB (x , _) -> x
                   HcompB si bo ->
                       si |> tabulateFaces n
                          |> List.map (\(f , x) -> sideTrans n f True (colA n x))
                          |> listInsert 0 (centerTrans n (colA n bo))
                          |> combineDrawings   


           -- csr = stripesRasterizer                
                           
           renderCell : Int -> Cell -> Result String (Drawing ())
           renderCell n cl = Ok ([                                     
                                  ( (2 ,  [[ 0 , 0 ]
                                          ,[ 0 , 1 ]
                                          ,[ 1 , 0 ]
                                          ,[ 1 , 1 ]]) ,())
                                  ,( (1 ,  [[ 0 , 0 ] ,[ 0 , 1 ]]) , ())
                                  ,( (1 ,  [[ 0 , 0 ] ,[ 1 , 0 ]]) , ())
                                  ,( (1 ,  [[ 1 , 1 ] ,[ 0 , 1 ]]) , ())
                                  ,( (1 ,  [[ 1 , 1 ] ,[ 1 , 0 ]]) , ())    
                                 ] )              


           --sideTA3 n f = Tuple.mapFirst (sideOrientationFix n f)                   
                                
     in
       
        {
           toStr = const2 "vecOK"
         , renderCells = renderCell  
         , fillMissing = fiMi
         , transA3 = const identity        
         , transA3fill = const2 identity
         , collectAll = colA
                      
               
        }                     


countColorize : Drawing a -> Drawing Color.Color         
countColorize = List.indexedMap (\i -> Tuple.mapSecond (\_ -> nThColor i)) 
    
centerTrans : Int -> Drawing () -> Drawing ()
centerTrans n = mapCoords (postcompose centerTransInv)

sideTrans : Int -> Face -> Bool ->  Drawing () -> Drawing ()
sideTrans n f b = mapCoords (sideTransInv f b)            
