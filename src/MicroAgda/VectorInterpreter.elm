module MicroAgda.VectorInterpreter exposing (..)

import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T

import MicroAgda.Drawing exposing  (..)

import MicroAgda.StringTools exposing (..)

import Color

import ResultExtra exposing (..)

import Canvas.Settings.Line exposing (..)

import Debug exposing (..)

import Dict

import Set

import Combinatorics exposing (..)

import MicroAgda.Viz exposing (..)

import MicroAgda.RasterInterpreter exposing (..)
    


    
mkVecIPR : (Int -> Cell -> (Drawing (MetaColor)))
           -> Interpreter (Drawing (MetaColor))
mkVecIPR renderCell =
     let


           sideFix : SubFace -> (Drawing MetaColor) -> (Drawing MetaColor , Bool)
           sideFix sf = 
               let n = lengthLI subFaceLI sf
                   rn = getSubFaceDim sf        
               in        
                   toFaceForce sf
                   |> Maybe.map (\f -> \drw ->
                          (case (getDrawingDim drw) of
                              Just m -> if m == (rn + 1)
                                        then (if m == n
                                              then (drw , True) --(degenDrawingSide sf drw , True)
                                              else (drw , True))
                                        else (if ( m == (n - 1) && (rn == m)  )
                                              then 
                                                (
                                                 (degenDrawingMissingSide (n - 1) f drw)
                                                  |> mapColor (setSaturation 0.7 >>
                                                                   setLightness 0.7)
                                                , False)
                                                -- ([] , False)
                                               else (todo ""))       
                              Nothing -> (drw , True)

                                ))
                   |> Maybe.withDefault (pairR True) -- <- should not happen 

                   --n f          
               -- (case (getDrawingDim x) of
               --     Just m -> if m == n
               --               then
               --                     -- let q = log ("ok Dim" ++ (String.fromInt n)) () in
               --                     (x , True)
               --                     -- ( [] , True)
               --               else (if ( m == (n - 1) )
               --                     then 
               --                       -- (
               --                       --  (degenDrawingSide (n - 1) f x)
               --                       --   |> mapColor (setLightness 0.70)
               --                       -- , False)
               --                       ([] , False)   
               --                     else (todo "")
               --                    )    
               --     Nothing -> (x , True))

           fixO : Int -> CubAC (Drawing MetaColor) -> CubAC (Drawing MetaColor)
           fixO n0 c =
               let n = getD c |> Maybe.withDefault n0 in
               case c of
                   PCubA x -> PCubA x
                   HcompA si bo -> 
                       HcompA
                           (\sf ->
                                toFaceForce sf
                               |> Maybe.andThen (\f ->
                                            
                                 let (j , b) = f in
                                          (si sf)
                                       |> Maybe.map (\sisf ->       
                                         (fixO n (sisf))
                                                 
                                          |> ( pCubMapA (mapCoords (sideOrientationFixF n (j , b))) )
                                          -- |> pCubMapBFace (Tuple.mapFirst (switchVars (n - 1) j))
                                          |> pCubMapASubFace
                                                   (switchVarsSF j sf)                  
                                          
                                       )
                           ))     
                          (fixO n bo)
                  
           colA : Int -> CubAC (Drawing MetaColor) -> Drawing MetaColor 
           colA n0 c =
               let n = getD c |> Maybe.withDefault n0 in
               case c of
                   PCubA x -> x
                   HcompA si bo -> 
                       si |> tabulateSubFaces n                           
                          |> List.map 
                                (\(sf , xx) -> 
                                    -- toFace sf
                                    -- |> Maybe.map (\f -> 
                                         -- let (j , b) = f in
                                            -- xx |> Maybe.map (\x ->
                                                xx
                                                |> (colA n )
                                                |> (sideFix sf)
                                                |> sideTransSF sf
                                          -- ) 
                                      -- )
                                )
                          |> listInsert 0 (centerTrans n (colA n bo))
                          |> combineDrawings
                          
                             
           getD : CubAC (Drawing MetaColor) -> Maybe Int
           getD c =
               case c of
                   PCubA x -> getDrawingDim x
                   HcompA si bo -> getD bo 
                  
           cA : Int -> CubAC (Drawing MetaColor) -> Drawing MetaColor
           cA n0 x =
               let n = getD x |> Maybe.withDefault n0 in
                 x |> fixO n |> colA n
               
                             

                                
     in
       
        {
           toStr = const2 "vecOK"
         , renderCells = renderCell  
         -- , fillMissing = fiMi
         , collectAll = cA
                      
               
        }                     

outlineNd : Int -> a -> Drawing a 
outlineNd n a = drawFaces (unitHyCube n) (const a)
         
outline2d : a -> Drawing a 
outline2d a = drawFaces (unitHyCube 2) (const a)

    -- [( (1 ,  [[ 0 , 0 ] ,[ 0 , 1 ]]) , a)
    --         ,( (1 ,  [[ 0 , 0 ] ,[ 1 , 0 ]]) , a)
    --         ,( (1 ,  [[ 1 , 1 ] ,[ 0 , 1 ]]) , a)
    --         ,( (1 ,  [[ 1 , 1 ] ,[ 1 , 0 ]]) , a)    
    --        ]

countColorize : Drawing a -> Drawing Color.Color         
countColorize = List.indexedMap (\i -> Tuple.mapSecond (\_ -> nThColor i)) 
    
centerTrans : Int -> Drawing a -> Drawing a
centerTrans n = mapCoords (postcompose centerTransInv)

sideTrans : Int -> Face -> (Drawing a , Bool) -> Drawing a
sideTrans n f (x , b) = mapCoords (sideTransInv f b) x            

sideTransSF :  SubFace -> (Drawing a , Bool) -> Drawing a
sideTransSF sf (x , b) =                                     
      let n = lengthLI subFaceLI sf
          rest = (toSubFaceRest sf |> List.map (\(i , bb) -> embed i (const (b2f bb))))
          xx = (List.foldr (\f -> \d ->  (f d)) x rest)
          -- xxx = if List.length rest > 0
          --       then log "rest" ( x , log "restXXX" xx)
          --       else ( x , xx)    
      in        
          toFaceForce sf
          |> Maybe.map (\f -> sideTrans n f (xx , b))
          |> Maybe.withDefault x -- <- should not happen   
                
piramFn : Int -> List Float -> Float 
piramFn n lf = 
    sideGet n (lookByIntInList lf >> Maybe.withDefault 0)
    |> Maybe.map (Tuple.first >> Tuple.second
                      >> (\x -> x / compPar)
                      >> negF >> vertSideFix
                 )
    |> Maybe.withDefault (0)


degenDrawingSide : SubFace -> Drawing MetaColor -> Drawing MetaColor       
degenDrawingSide sf =
               let n = lengthLI subFaceLI sf
                   rn = getSubFaceDim sf        
               in
                   todo ""
                   
degenDrawingMissingSide : Int -> Face -> Drawing MetaColor -> Drawing MetaColor
degenDrawingMissingSide n (k , b) =
    List.map
        (\( ( m , pl ) , mc ) ->
             ((case mc of
                 Nothing ->
                   let efFlat = (const 1)  
                       efPiram =  piramFn n
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
        
    -- List.map
    -- (Tuple.mapFirst             
    -- (\x -> fillPrll k
    --    (embedPrll k (const 0) x)
    --    (embedPrll k (const 1) x) 
    -- ))                       
                        

------ concrete interpreters

-- vCellOutlineIPR : Interpreter (Drawing ())
-- vCellOutlineIPR = (\n -> \cl ->
--                         (combineDrawings                                     
--                                   [
--                                    [( unitHyCube n , ())]
--                                   ,
--                                   (outline2d ())]
--                           )
--                   ) |> mkVecIPR



type alias CSetVectorizer =
    {
          insGen : Int -> Boundary -> Inside -> Drawing Int    
    }    

sripesVectorizer : CSetVectorizer
sripesVectorizer =
    { insGen = \n -> \bnd -> \ins ->
              (case n of
                  0 -> emptyDrawing 
                  1 -> stripesFromList
                           (getBoundaryCorner (subset1 False) bnd
                           ,getBoundaryCorner (subset1 True) bnd)
                            -- [0 , 0.1 , 0.6 , 1.0]
                            -- (
                            --  let l =
                            --            rangeFloat 12 0 1
                            --               |> List.map
                            --               (\x -> x ^ 3)
                            --               |> List.map
                            --               (\x -> x * 0.5)
                            --  in  List.concat [l , [0.5] , (List.reverse (l |> List.map (negF)))]
                            -- )
                             (rangeFloat 12 0 1)
                            -- (List.append (rangeFloat 5 0 0.5) [1])
                               
                  _ -> emptyDrawing)
    }

-- only idea!!    
pipesVectorizer : CSetVectorizer
pipesVectorizer =
    { insGen = \n -> \bnd -> \ins ->
              (case n of
                  0 -> emptyDrawing 
                  _ ->
                       combineDrawings
                       [
                         [((unitHyCube n) , (1))]
                         |> (mapCoordsAsL (List.map (\x -> ((x - 0.5) * 0.5) + 0.5 )))
                        ,
                         [((unitHyCube n) , (0))]
                         |> (mapCoordsAsL (List.map (\x -> ((x - 0.5) * 1.0) + 0.5 )))
                        ]     
                   )
    }
    
univVectorizer : CSetVectorizer
univVectorizer =
    { insGen = \n -> \bnd -> \ins ->
              (case n of
                  0 -> emptyDrawing 
                  _ ->
                       combineDrawings
                       [
                         [((unitHyCube n) , (1))]
                         |> (mapCoordsAsL (List.map (\x -> ((x - 0.5) * 0.5) + 0.5 )))
                        ,
                         [((unitHyCube n) , (0))]
                         |> (mapCoordsAsL (List.map (\x -> ((x - 0.5) * 1.0) + 0.5 )))
                        ]     
                   )
    }
    
cSetVectorize : CSetVectorizer -> CSet -> Drawing (Int)
cSetVectorize csv cs =
    (case cs of
        CSet n bd ins -> csv.insGen n bd ins
        Degen k x -> degenDrawing k (cSetVectorize csv x)
        CPoint x -> [(ptZero , x)])              
                           

pieceMask : Int -> Piece -> Drawing (Int)
pieceMask n pc =
    let (cornerL , perm) =
            Tuple.second (isoPiece) pc
            |> Tuple.mapFirst subsetLI.toL    

        cornerL2 = permuteList perm cornerL 
               
        pieceMaskH : List (Bool , Int) -> Prll   
        pieceMaskH = List.foldr (\(b , i) -> \prl ->
                           fillPrll i
                                     ( embedPrll i (const (0.5))
                                           (prl |>
                                             Tuple.mapSecond (List.map (List.map (const 0.5))) 
                                           )
                                     )
                                     ( embedPrll i (const (b2f (b))) prl )

                                ) ptZero 
            
    in [(pieceMaskH (zip (cornerL2 , (permutationLI.toL perm) )) , (pieceLI.toI pc)) ]
      
                    
cellDrawCombine : Int -> Cell -> (CSetVectorizer) -> Drawing (MetaColor)
cellDrawCombine n cl csv = 
       let pcsD = (cl >> cSetVectorize csv >> (mapDrawingData (pairFrom nThColor (const [])))) in
      (\pc -> masked
           (pieceMask n pc ) -- |>  (mapDrawingData nThColor) |> unmasked  
           (pcsD pc) 
      )
      |> mapAllPieces n           
      |> combineDrawings
         
stripesIPR : Interpreter (Drawing MetaColor)
stripesIPR =  (\_ -> \cl ->
                        let n = dimOfCell cl in 
                        (combineDrawings                                     
                                  [
                                  --  unmasked [( unitHyCube n , (Color.black))]
                                  -- ,
                                       (cellDrawCombine n cl
                                            sripesVectorizer
                                            -- univVectorizer
                                       )
                                     ,
                                      masked
                                      (outlineNd n ())
                                      -- |> (mapDrawingData (const (Color.blue , []))) |> unmasked  
                                      -- unmasked
                                      -- []
                                      (outlineNd n (Color.black , [
                                                         -- lineDash [10 , 10]
                                                        ]))
     
                                  ]
                          )
                  ) |> mkVecIPR
    

