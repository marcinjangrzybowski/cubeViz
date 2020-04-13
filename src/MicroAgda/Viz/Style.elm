module MicroAgda.Viz.Style exposing (..)

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
import  MicroAgda.Viz.FloatFunctions exposing (..)

borderComPar = 0.05



drawCSet : CSet -> (Drawing DStyle)
drawCSet cs =
    case cs of
        CSet (0 , cSetCrnrs) ->
            
                [(unitHyCube 0 , (nThColor (cSetCrnrs (Subset 0 0) |> Tuple.second) , []))]
                

        CSet (n , cSetCrnrs) ->

            -- let
            
            let cornersColors : Subset -> Color.Color
                cornersColors crnr =
                    (cSetCrnrs crnr)
                     |> Tuple.second
                     |> nThColor

                cornersCodes =
                        cSetCrnrs
                     >> Tuple.first >> Tuple.second
                       
                centerMargin = 0.05

                sideMargin = 0.3

                size = 1.0 - centerMargin - sideMargin

                codeMarg = 0.2
                      
                codeN = 3
                       
                cornersShp : Subset -> Drawing (DStyle) 
                cornersShp crnr =
                       ((segmentsRange codeN
                            (codeMarg / (toFloat codeN))
                            (1 - (codeMarg / (toFloat codeN)))
                        |> List.map (\(x0 , x1) ->
                            (spanPrll n
                                 (x0 - codeMarg / (toFloat codeN))
                                 (x1 + codeMarg / (toFloat codeN))
                            , ( (Color.gray) , []))))
                       |> List.indexedMap (\i -> \x ->                                               
                             if (subsetLI.toL
                                  (Subset codeN ( modBy (codeN ^ 2) (cornersCodes crnr) ))
                                 |> (swapFn lookByIntInList) i
                                 |> Maybe.withDefault (False)    
                                ) 
                             then Just x
                             else Nothing
                            )
                       |> List.filterMap (identity)
                       )    
                    ++ [(unitHyCube n , ( (cornersColors crnr) , []))]                
                                  
            in  mapAllLI subsetLI n (\crnr ->
                        cornersShp crnr 
                     |> scale (size / 2)
                     |> translate (List.repeat n (sideMargin / 2))                    
                     |> mapCoordsAsL
                          (\l ->
                               zip (subsetLI.toL crnr , l)
                               |> List.indexedMap ( \i ->  \(b , f) ->
                                   choose b f (negF f)                  
                                           ))
                     -- |> translate (subsetLI.toL crnr
                     --           |> List.map (boolElim
                     --                            (sideMargin / 2)
                     --                            (0.5 + (centerMargin/2))
                     --                       )
                     --                 )
                         )
                |> List.append [[(unitHyCube n , (Color.gray , []))]]
                |> List.reverse   
                |> combineDrawings
                   
                
                          
        Degen k x -> drawCSet x |> (degenDrawing k)            

drawInside : Inside -> (Drawing MetaColor)
drawInside (n , ins) = (n , ins) |> CSet |> drawCSet |> masked [(unitHyCube n , ())] 
    
missColTrans : Color.Color -> Color.Color
missColTrans =
    Color.toHsla >>
    (\x ->
         if x.saturation > 0.8
         then {x | saturation = 0.6 , lightness = negF ((negF x.lightness) * 0.5) }
         else {x | lightness = negF ((negF x.lightness) * 0.5) }

    )
    >> Color.fromHsla
          
styliseMissing : Drawing (MetaColor) -> Drawing (MetaColor)                     
styliseMissing = mapColor missColTrans


    --mapColor ( setLightness 0.7  >> setSaturation 0.7 )
