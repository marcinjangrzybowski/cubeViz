module MicroAgda.Viz.Process exposing (..)

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
import  MicroAgda.Viz.Style exposing (..)


               
makeDrawCtx : (C.CType , I.Term) -> Result String (I.Term , DCtx)
makeDrawCtx (ct0 , tm0) = maybeLoop
                  (convergeResult (\_ -> Nothing )
                       (\((ct , tm) , dc) ->
                            ct |> C.toTm |> I.toPiData
                            |> Maybe.map (\(do , bo) ->
                                (I.absApply bo (I.Def (I.FromContext ( (List.length dc.list) )) []))
                                |> Result.andThen (\tyTm  -> (
                                          case tm of  
                                             I.Lam _ tmAbs                 
                                                 -> (I.mkApp tm (I.ctxVar ((List.length dc.list)))) 
                                                     |> Result.andThen (\nTm ->      
                                                          ((C.CT tyTm , nTm) ,
                                                              (extend (tmAbs.absName)
                                                                dc (C.CT do.unDom)  )

                                                          ) |> resultPairR )
                                             _ -> Err ( "not a lambda")
                                                  )             
                                              )
                                         )
                       )
                  )
                  
                 (Ok ((ct0 , tm0), emptyCtx))
                |> Result.map (\((_ , t) ,c ) -> (t , c)) 



              
step0 : (I.Term , DCtx) -> Result String (Cub N1)
step0 (tm , dc) =
            
    let
        dim = dimOfCtx dc

        mkCase : String -> I.PartialCase -> (Result String (SubFace , Cub N1))
        mkCase varN pc =
            (List.foldl
                 (\(tmv , b) -> Result.andThen (\(c , sf) ->
                     toVarAndIndex dc tmv
                   -- |> Result.fromMaybe ("not in normal form: " ++ (T.t2strNoCtx tmv) )
                   -- |> Result.mapError (\x -> let _ = log "xx" tmv in x)                                  
                   |> Result.andThen ( \(i , DimIndex j) ->
                       mkBound c (i , b)
                    -- Ok c                       
                    |> Result.map (\c2 ->
                                (c2 , Dict.insert j b sf)
                                      )))                               
                     )
                 (Ok (dc , Dict.empty)) (pc.subFace) )
            |> Result.map (Tuple.mapSecond ( subFaceFromDict dim

                                           ))    
            |> Result.andThen (\(cc , sf) ->
                       I.absApply (I.notAbs pc.body) (I.ctxVar (getFresh dc))             
                    |> Result.andThen (\bo2 ->              
                      (step0 (
                                bo2 , extendI cc varN))
                    |> Result.map (Tuple.pair sf))               
                              )

        mkSides : I.Term -> Result String  (String , (SubFace -> Maybe (Cub N1)))
        mkSides ptm = 
            I.toHcompCases ptm
           |> Result.fromMaybe "ImposibleError, not proper sides in hcomp"
           |> Result.andThen (\(varN , pcs) ->
                    mapListResult (mkCase varN) pcs
                   |> Result.map (makeFnSubFace >> Tuple.pair varN)
                             )   
    in
      
    (case tm of
       (I.Def (I.BuildIn I.Hcomp) (_ :: _ :: _ :: sidesE :: botE :: []))
         ->    step0 (I.elimArg botE , dc)
            |> (mkSides (I.elimArg sidesE)
            |> Result.map2 (\(name , y) -> \x -> Hcomp tm name y x) 
               )
       _ -> Ok (Cub tm {term = tm})      
    ) |> describeErr "step0"   
    
    
step1 : StepNo N1 N2
step1 dc n _ _ n1 =
    (case (n1.term) of
        I.Def (I.FromContext i) tl ->
            let il = (List.map I.elimArg tl)
            in piecesStratTail dc il
               |> Result.map (\tp -> 
                  { head = i
                  , tailClean = il
                  , original = True              
                  , tailPieces = tp }) 
        _ ->
              -- let _ = log "badTerm: " n1.term  in
              Err "nor hcomp, nor propper definition with tail")     
    |> describeErr ("step1 " ++ T.t2strNoCtx n1.term)


n2ToTerm : Cub N2 -> I.Term
n2ToTerm cn2  =
    case cn2 of
        Cub tm x -> tm
        Hcomp tm vName sides cap
            -> tm
    
 
                                    

       
drawInsidePiecesStep : StepNo N2 N3
drawInsidePiecesStep dc n tm _ n2 =
   drawInsidePieces dc n tm n2
   |> Result.map (\x -> { zones = x  })

      

piecesCombine : Int -> (Piece -> (Drawing DStyle)) -> Result String (Drawing (MetaColor))
piecesCombine n pcsD =
      (\pc ->
           masked
           (pieceMask n pc ) -- |>  (mapDrawingData (\k -> (nThColor k , []))) |> unmasked  
           (pcsD pc) 
      )
      |> mapAllPieces n
      |> combineDrawings |> Ok   
      -- |> combineDrawingsSafe
      -- |> describeErr "piecesCombine"   

      
piecesCombineStep : StepNo N3 N4
piecesCombineStep dc n _ _ n3 =
    piecesCombine n n3.zones
    |> Result.map (\x -> { whole = x})              



drawGenericTerm : DCtx -> Int -> Result String ((Int , Drawing MetaColor))
drawGenericTerm dcAll i =
     (makeGenericTerm dcAll i)
     |> Result.andThen drawTerm
     |> Result.map (\(_ , n , (_ , dw)) -> (n , dw))   
    


transAddressUF : Address -> Drawing MetaColor -> Drawing MetaColor
transAddressUF address =
    case address of
        [] -> identity
        h :: tl ->
            let n = lengthLI subFaceLI h in
            transAddressUF tl >> (
             case (subFaceCases h) of
               Nothing -> centerTransDrw defaultCompPar n 
               Just sf -> pairR True >> sideTransSF defaultCompPar sf

                               )

transAddress : Address -> Drawing MetaColor -> Drawing MetaColor
transAddress = toPreOF >> transAddressUF
                         

combineCell : DCtx -> Int -> (Drawing MetaColor) -> (Face -> Result String (Drawing MetaColor))
                 -> Result (String) (Drawing MetaColor)
combineCell dc n center fcs =  
     let borderSideFix : Face -> Drawing a -> (Drawing a , Bool)
         borderSideFix (i , _) drw =
            (degenDrawing i drw , False)
    
     in tabulateFaces n
        (\f -> let sf = (faceToSubFace n f) in
                fcs f
              
                |> Result.map (borderSideFix f)
                |> Result.map (sideTransSF borderComPar sf)
                        
                                   

             ) |> List.map (Tuple.second)
             |> mapListResult identity
             |> Result.map (\x -> List.append x [(centerTransDrw borderComPar n center)])
             |> Result.map (List.append (
                         [masked
                            (outlineNd n ())
                            (outlineNd n (Color.black , [
                                               -- lineDash [10 , 10]
                                              ]))]

                               ))   
         -- |> Result.andThen (combineDrawingsSafe)
             |> Result.map (combineDrawings)   
             |> Result.andThen (\x ->
                     if (dimOfCtx dc == n)
                     then (Ok x)               
                     else (Err "dim not matching context")
               )
                
addBordersStep : StepNo N4 N4        
addBordersStep dc n tm _ n4 =
     if (dimOfCtx dc /= n)
     then (Err "dim not matching context")               
     else 
       combineCell dc n n4.whole
         (\f ->
              let sf = (faceToSubFace n f) in
              -- let _ = logDCtx (const dc) () in
              -- let _ = log (String.fromInt (n) ++ " :! "++ (T.t2str (toCtx dc) tm) ) tm in
                     mkBoundSF dc sf                        
                  |> Result.andThen (
                      \dcSF -> 
                             (termFace dc f tm)
                           -- |> Result.map(\x -> log (String.fromInt (n) ++ " : "++ (T.t2str (toCtx dcSF) x) ) x) 
                           |> Result.andThen (
                                 \ftm ->                                  
                                     drawTerm (ftm, dcSF)
                                  |> Result.map (\(_ , _ , ( _ , x) ) ->
                                                         x           
                                                ))))
        |> Result.map (\all -> { n4 | whole = all })
        |> Result.andThen (\x ->
                      if (dimOfCtx dc == n)
                      then (Ok x)               
                      else (Err "dim not matching context")
                )




       
             
drawInsidePieces : DCtx -> Int -> I.Term -> N2 -> Result String (Piece -> Drawing DStyle) 
drawInsidePieces dc n term n2 =                           
    lookInside dc n2.head
    |> Result.andThen ( \ins ->
          mapAllPieces n (\pc ->
                 let rmp = (tailPieces2Remap n n2.tailPieces pc) in             
                 (remap rmp (CSet ins ))
                 |> drawCSet
                 |> (Tuple.pair pc) |> Ok
                         )
                         
          |> mapListResult identity
          |> Result.map (
               makeFnPiece
              >> postcompose (Maybe.withDefault [])
           ))    

drawTerm : (I.Term , DCtx) -> Result String (DCtx, Int , (Cub N2 , Drawing MetaColor))     
drawTerm (tm , dc0) = 
    tm2Cub dc0 tm
    |> Result.andThen (\(dc , n , cn2) ->
          Ok (dc , n , cn2)
       |> (stepMap drawInsidePiecesStep)
       |> (stepMap piecesCombineStep)
       |> (stepMap addBordersStep)   
       |> Result.andThen addMissingDrawings   
       |> (Result.map (\(dcc , nn , x ) -> (dcc , nn , fixOrientation ( nn , x ))))    
       |> (Result.andThen combineCells)
       |> Result.map (\(dcc , nn , x) -> (dcc , nn , (cn2 , x) ))                    
    )                       

allWork : AllWork
allWork = 
    makeDrawCtx
   >> Result.andThen (drawTerm)   

              
-- tm2Cub : _
tm2Cub dc tm =
   step0 (tm , dc)
   |> Result.map (\x -> (dc , dimOfCtx dc , x))     
   |> stepMap (step1) 

vizualize = allWork >> Result.map (\(_ , _ , x) -> x)

----

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



fixOrientation : (Int , Cub N4) -> Cub N4
fixOrientation (n , cn4) =
      case cn4 of
           Cub tm x -> Cub tm x
           Hcomp tm vName sides cap
               ->  Hcomp tm vName
                   (\sf -> 
                        toFaceForce sf
                       |> Maybe.andThen (\f ->

                         let (j , b) = f in
                                  (sides sf)
                               |> Maybe.map (\sisf ->
                              let                
                                   n3 = (getSubFaceDim sf) + 1
                              in                
                                  (fixOrientation (n3 , sisf))

                                  |> ( cubMap (
                                       \n4 ->
                                       { n4 | whole = mapCoords (sideOrientationFixF n (j , b)) n4.whole }
                                              ) )
                        
                                  |> cubMapSubFace
                                           (switchVarsSF j sf)                  

                               ))
                   )     
                  (fixOrientation (n , cap))

fixOrientationNOOP : (Int , Cub a) -> Cub a
fixOrientationNOOP (n , ca) = 
      case ca of
           Cub tm x -> Cub tm x
           Hcomp tm vName sides cap
               ->  Hcomp tm vName
                   (\sf -> 
                        toFaceForce sf
                       |> Maybe.andThen (\f ->

                         let (j , b) = f in
                                  (sides sf)
                               |> Maybe.map (\sisf ->
                              let                
                                   n3 = (getSubFaceDim sf) + 1
                              in                
                                  (fixOrientationNOOP (n3 , sisf))
                        
                                  |> cubMapSubFace
                                           (switchVarsSF j sf)                  

                               ))
                   )     
                  (fixOrientationNOOP (n , cap))                          

addMissingDrawings : (DCtx , Int , Cub N4) -> Result String (DCtx , Int , Cub N4)
addMissingDrawings (dc , n0 , cn4 ) =
    let addMD dcSF nn x = addMissingDrawings (dcSF , nn , x) |> Result.map (\(_ , _ , y) -> y)
  
                      
                      
                      
        missingDrawings : I.Term -> String -> (SubFace -> Maybe (Cub N4)) -> Cub N4
                           -> Result String (List (SubFace , Cub N4)) 
        missingDrawings tm vName sides cap =
            let missingFaces : List (Face, SubFace)
                missingFaces = tabulateFaces n0
                                            (\f ->
                                                 case sides (faceToSubFace n0 f) of
                                                     Just _ -> Nothing
                                                     Nothing -> Just (f , (faceToSubFace n0 f) )
                                            )
                                        |> List.filterMap Tuple.second
                                           
                makeMissingN4s : (Face, SubFace) -> Result String (SubFace , Cub N4)           
                makeMissingN4s (f , sf) =
                    mkBoundSF dc sf                        
                  |> Result.andThen (
                      \dcSF -> 
                             (termFace dc f  tm) 
                           |> Result.andThen (
                                 \ftm ->                                  
                                     drawTerm (ftm, dcSF)
                                  |> Result.map (\(_ , _ , ( _ , x) ) -> (sf , Cub ftm {whole = x}))
                                             )
                          )
                     
                                     
            in missingFaces |> mapListResult makeMissingN4s
    in
    case cn4 of
        Cub tm x -> Ok (dc , n0 , cn4)
        Hcomp tm vName sides cap ->


            let sidesFilled = sides
                           |> tabulateSubFaces n0                           
                           |> mapListResult 
                                (\(sf , xx) ->  
                                                (subfaceCtx dc vName sf)
                                                |> Result.andThen
                                                   (\dcSF -> addMD dcSF (getSubFaceDim sf + 1) xx )
                                                |> Result.map (Tuple.pair sf)
                                       )
                              
                capFilled = (addMD dc n0 cap)

                missFcs = (missingDrawings tm vName sides cap)
                          |> describeErr "missDrw"

                            
                combinedSides =
                    sidesFilled
                        |> (missFcs
                        |> Result.map2 (List.append))
                        |> Result.map (makeFnSubFace)
                                
            in
                capFilled
                |> (combinedSides
                |> Result.map2 (Hcomp tm vName))
                |> Result.map (\x -> (dc , n0 , x))
                   
--- it is aplied after fixing the orientation!!                 
combineCells : (DCtx , Int , Cub N4) -> Result String (DCtx , Int , Drawing (MetaColor))
combineCells (dc , n0 , cn4 ) =
    let colA dcSF nn x = combineCells (dcSF , nn , x) |> Result.map (\(_ , _ , y) -> y)

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
                                                 (degenDrawingMissingSide defaultCompPar (n - 1) f drw)
                                                  |> styliseMissing
                                                , False)
                                                -- ([] , False)
                                               else ([] , False)) -- !!! <- it is only placeholder!! 
                              Nothing -> (drw , True)

                                ))
                   |> Maybe.withDefault (pairR True) -- <- should not happen 
  
                      
    in
    case cn4 of
        Cub tm x -> Ok (dc , n0 , x.whole)
        Hcomp tm vName sides cap ->


            let sidesDrw = sides
                           |> tabulateSubFaces n0                           
                           |> mapListResult 
                                (\(sf , xx) ->  
                                                (subfaceCtx dc vName sf)
                                                |> Result.andThen
                                                   (\dcSF -> colA dcSF (getSubFaceDim sf + 1) xx )
                                                |> Result.map (sideFix sf)
                                                |> Result.map (\(dr , b) ->

                                                               ( choose b 0 1 ,    
                                                               sideTransSF defaultCompPar sf (dr , b)
                                                               )    
                                                              )
                                                -- |> Result.map (Tuple.pair 1)

                                )
                           |> Result.map (List.sortBy Tuple.first)   
                           |> Result.map (List.map Tuple.second)
                           |> Result.map combineDrawings
                              
                capDrw = (colA dc n0 cap) |> Result.map (centerTransDrw defaultCompPar n0)


            in [sidesDrw , capDrw  ]
                |> mapListResult (identity)
                |> Result.andThen combineDrawingsSafe   
                |> Result.map (\x -> (dc , n0 , x))
                |> describeErr "combineCells"         

centerTransDrw : Float -> Int -> Drawing a -> Drawing a
centerTransDrw cp n = mapCoords (postcompose (centerTransInv cp))
                             
sideTransDrw : Float -> Int -> Face -> (Drawing a , Bool) -> Drawing a
sideTransDrw cp n f (x , b) = mapCoords (sideTransInv cp f b) x            
                             
sideTransSF :  Float -> SubFace -> (Drawing a , Bool) -> Drawing a
sideTransSF cp sf (x , b) =                                     
      let n = lengthLI subFaceLI sf
          rest = (toSubFaceRest sf |> List.map (\(i , bb) -> embed i (const (b2f bb))))
          xx = (List.foldr (\f -> \d ->  (f d)) x rest)
          -- xxx = if List.length rest > 0
          --       then log "rest" ( x , log "restXXX" xx)
          --       else ( x , xx)
          fixedRest = toFaceForce sf
                      |> Maybe.map (\f -> sideTransDrw cp n f (xx , b))
                      |> Maybe.withDefault x  -- <- should not happen     
      in
      case (rest , n) of
        ([y] , 2) -> --fixedRest   
                     combineDrawings
                      [
                       extrudeDrawingBi
                           (subFaceLI.toL sf
                           |> List.indexedMap
                                (\i ->  Maybe.map (\(bb) -> 
                                  case i of
                                    0 -> (choose (not bb) -1 1)
                                    _ -> (choose bb -1 1)
                                  )
                                )
                           |> List.filterMap (Maybe.map (\z -> z * 0.01 )))
                           fixedRest
                      -- ,extrudeDrawing [0.05 , 0.05] fixedRest
                      ]    
        ([] , _)-> fixedRest      
        _ -> fixedRest 

                             

outlineNd : Int -> a -> Drawing a 
outlineNd n a = drawFaces (unitHyCube n) (const a)


pointDettect : List Float -> Cub a -> Maybe Address                 
pointDettect pt ca =
     let param = defaultCompPar
         n = (List.length pt)
     in        
     case ca of
         Cub _ _ -> Just []
         Hcomp _ _ si cup ->
             let arr i = lookByIntInList pt i |> Maybe.withDefault 0  in
             case sideGet param n (arr) of
                 Nothing ->
                        pointDettect (List.map (centerTrans param) pt) cup
                     |> Maybe.map (\x -> (subFaceCenter n) :: x)
                 Just ((i , _) , b) ->
                     let f = (i , b)
                         sf = faceToSubFace n f
                     in si sf
                        |> Maybe.andThen ( pointDettect
                                             (actOnArr (sideTrans param f True)  pt
                                             |> swapLastWithIth i
                                             )   
                                         )
                        |> Maybe.map (\addr -> sf :: addr)   
                       
