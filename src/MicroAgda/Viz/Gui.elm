module MicroAgda.Viz.Gui exposing (..)

import MicroAgda.Internal.Ctx as C
import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Translate as T
import MicroAgda.Internal.TranslatePretty as TP
import MicroAgda.TypeChecker as TC

import MicroAgda.Drawing as Drw exposing  (..)

import MicroAgda.StringTools exposing (..)

import Color

import ResultExtra exposing (..)

import Either exposing (leftToMaybe)

import Debug exposing (..)

import Dict

import Set

import Canvas.Settings exposing (..)
import Canvas.Settings.Line exposing (..)

import Combinatorics exposing (..)

import  MicroAgda.Viz.CodeViz exposing (..)
import  MicroAgda.Viz.FloatFunctions exposing (..)
import  MicroAgda.Viz.PiecesEval exposing (..)
import  MicroAgda.Viz.Process exposing (..)
import  MicroAgda.Viz.Remap exposing (..)
import  MicroAgda.Viz.Structures exposing (..)
import  MicroAgda.Viz.Style exposing (..)

import Css exposing (..)
import Css.Animations as Anim

import Html
import Html.Attributes as HA
import Html.Events.Extra.Mouse as EM
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css, href, src , id)
import Html.Styled.Events exposing (onClick)
import Html.Styled.Lazy exposing (..)

import Gui.Draw exposing (..)


handleDifrentDims : List Style -> DrawingHTMLSettings -> Int
                  -> Drawing (MetaColor) -> Result String (Html msg)
handleDifrentDims ls s n drw0 =
            let viz0 drw = drw |> (degenDrawing 0) |> (degenDrawing 1)
                           |> drawingHTML (Just {s | width = s.width // lowDimFactor  , height = s.width // lowDimFactor }) 
                           |> Ok

                viz1 drw = (degenDrawing 0 drw)                      
                           |> drawingHTML (Just {s | width = s.width // lowDimFactor }) 
                           |> Ok

                viz2 drw = Ok (drawingHTML (Just s) drw)

                -- padLeft =
                --     case n of
                --         0 -> (toFloat s.width) * (1 - (1 / (toFloat (lowDimFactor)))) * 0.5
                --         1 -> (toFloat s.width) * (1 - (1 / (toFloat (lowDimFactor)))) * 0.5      
                --         _ -> 0    
                           
            in (case n of
                   0 -> viz0 drw0
                   1 -> viz1 drw0
                   2 -> viz2 drw0 
                   _ -> Err ("visuzalization of terms in "
                                 ++ (String.fromInt n) ++ " dimension not suported yet")
               ) |> Result.map fromUnstyled
                 |> Result.map (\canv -> div [ css (
                                                    -- [paddingLeft (px padLeft)] ++
                                                        ls
                                                   ) ] [canv]) 

pulsationAmination : List Style
pulsationAmination =
    let kfms = Anim.keyframes
            [ (0 , [Anim.property "opacity" "1"])
            , (80 , [Anim.property "opacity" "0.2"])
            -- , (100 , [Anim.property "opacity" "0"])
            ]
    in [
         animationName kfms
       , animationDuration (sec 1)
       , property "animation-iteration-count" "infinite"
    ]


relativePos : EM.Event -> ( Float, Float )
relativePos mouseEvent =
    mouseEvent.offsetPos


dimArrowBlockDrawing : Int -> Int -> String -> Drawing (DStyle)
dimArrowBlockDrawing n i vName =
    let
        aWi = 0.05
        aMarg = 0.1      
        segs =
            range n
          |> List.map (\j -> choose (i == j) (Seg aMarg (aMarg + aWi)) (Seg aMarg (1 - aMarg)))
    in
    
    [
      (fromLSeg segs , (Color.black , [])) 
    ]

dimArrowDrawing : Int -> Int -> String -> Drawing (DStyle)
dimArrowDrawing n i vName =
    let
        aWi = 0.05
        aMarg = 0.1      
        segs =
            range n
          |> List.map (\j -> choose (i == j) (Pt (aMarg)) (Seg aMarg (1 - aMarg)))
    in
    
    [
      (fromLSeg segs , (Color.black , [lineWidth 5])) 
    ]
    
                  
inspectorOverlay : Maybe Address -> Int -> Cub a -> Int
                    ->  List (Html (Maybe Address))
inspectorOverlay mba bigCanvasSize ca n =
    let bcs = { width = bigCanvasSize , height = bigCanvasSize , bgColor = Nothing
              , styles = [("position","absolute")] }

        selShp : Address -> Drawing DStyle     
        selShp addrs =
            let m = finalAddressDim n addrs in
            combineDrawings
              (List.append
                   [  [(unitHyCube m , ((Color.rgba 0 0 0 0.5) , []))] ]
                   (if m == n
                    then [
                     (outlineNd 2 (Color.black , [lineWidth 4]))
                   , (outlineNd 2 (Color.white , [lineWidth 2 , lineDash [ 5 , 5] ]))
                        ] 
                      -- ++(range n |> List.map (\i -> dimArrowDrawing n i "x"))
                    else []))
                  
        arrShp : Address -> Drawing DStyle          
        arrShp addrs =
            let m = finalAddressDim n addrs in
            combineDrawings
              (List.append
                   [  ]
                   (if m == n
                    then (range n |> List.map (\i -> dimArrowDrawing n i "x"))
                    else []))
    in           
    mba |> Maybe.map ( \addrs ->
                        [

                         (drawingHTML
                             (Just bcs) ((selShp addrs) |> unmasked |> (transAddress addrs)))
                         |> fromUnstyled
                        |> List.singleton |> div [css pulsationAmination]
                        |> toUnstyled

                        , drawingHTML
                             (Just bcs) ((arrShp addrs) |> unmasked |> (transAddress addrs))
                        ]  
                       )

        |> Maybe.withDefault []
        -- |> List.map (drawingHTML (Just bcs))                        
        -- |> List.singleton 
        |> Html.div [EM.onDown (relativePos
                                >> mapSame ((\x -> x / (toFloat bigCanvasSize)))
                                >> (\(x , y) ->
                                        -- let _ = log "xx" (x,y) in
                                          pointDettect [x , y] ca)
                                
                                            ) , HA.style "width" "100%"
                                              , HA.style "height" "100%"
                    
                    ]
        |> fromUnstyled
        |> List.singleton
           
inspectorCanvas : Maybe Address -> Int -> Int -> Cub a -> Drawing (MetaColor)
                    ->  (Html (Maybe Address))
inspectorCanvas mba bigCanvasSize n ca drw0 =
    let bcs = { width = bigCanvasSize , height = bigCanvasSize , bgColor = Just Color.white
              , styles = [] }
        drawingCanv = lazyResHtml (handleDifrentDims [
                                         -- width (pct 100)
                                             
                                       ] bcs n) drw0
        overlayCanv = inspectorOverlay mba bigCanvasSize ca n               
    in div [css [position relative] , id "inspectorBox" ] [
           drawingCanv
        , div [
             
              
              css ([position absolute
              , top (px 0) , left (px 0)
              , width (px (toFloat bigCanvasSize) ) , height (px (toFloat bigCanvasSize) )]
                       -- ++ pulsationAmination
                  )
            ]
            overlayCanv 
        ]

                      
-- termHtml :  DrawingHTMLSettings -> Result String (C.CType , I.Term) -> Html msg
-- termHtml s =
--       Result.andThen (\(ct , tm ) ->
--          allWork (ct , tm)
--          |> Result.andThen (\(dc , n , (cn2 , drw0)) ->

--           handleDifrentDims [] s n drw0 
          
--    )) >> convergeResult
--         (\x -> node "pre" [] [text x] )
--         (identity)


termHtmlSimple : List Style -> Int -> (DCtx , I.Term) -> Result String (Html msg)
termHtmlSimple ls size (dc , tm) =
    drawTerm (tm , dc)
   |> Result.andThen (\(_ , n , (_ , drw)) ->
        handleDifrentDims ls
            { defCanvSet | width = size , height = size } n
                 drw     
                 ) |> describeErr "termHtmlSimple"      
                 
-- cSetHtml :  DrawingHTMLSettings -> Inside -> Result String (Html msg)
-- cSetHtml s (n , f) =
--     (n , f) |> drawInside |> handleDifrentDims s n

ctxCellStyle = css [display inlineBlock
                     , margin (px 8)
                     -- , minWidth (px ctxIconSize)
                     , textAlign center
                     -- , border3 (px 2) dotted (rgba 0 0 0 1)
                     
                     , padding (px 5)   
                   ]

ctxCellsRowStyle = css []
               
ctxIconSize = 128

lowDimFactor = 4              
               
ctxIconS : DrawingHTMLSettings
ctxIconS = { defCanvSet | width = ctxIconSize , height = ctxIconSize }

labelCss : List Style
labelCss = [ fontSize (px 14)
           , fontFamily monospace
           , textAlign center
           , backgroundColor (rgb 230 230 230)
           , padding (px 4)    
           ]          


mkLabelTy : C.Ctx -> C.CType -> String
mkLabelTy c ct =
          C.arity ct 
       |> Maybe.map (\art ->
            case art of
                _ -> (TP.ct2str c ct)     
         )              
       |> Maybe.withDefault "???"


          

          
ctxHtml : DCtx -> Result String (Html msg)
ctxHtml dc = 
    let c = toCtx dc in
    
    dc.list |> List.reverse |> List.indexedMap Tuple.pair
    -- |> List.reverse |> List.take 3 |> List.reverse
    |> mapListResult (\(i , (vName , ct , mb)) ->
      let labelR = Ok ( div [css labelCss] [
                             strong [] [ text vName ] ,
                             div [] [(text (mkLabelTy c ct))]
                                    ] )
                          
      in  labelR |> Result.andThen ( \label ->
          mb |> Maybe.map (\ec ->
              case ec of
                  EInterval -> Ok Nothing
                  ECSet (n , _) ->  
                               drawGenericTerm dc i
                               |> Result.andThen
                                   ( handleDifrentDims [ display inlineBlock ] ctxIconS |> uncurry )
                               |> Result.map (\x ->
                                  Just [x , label ]
                                 )
                               |> Result.map (Maybe.map (Tuple.pair n))
                
                   )
          |> Maybe.withDefault (Ok Nothing)
          )
     )
    |> Result.map (List.filterMap identity)
    |> Result.map (gatherByInt Tuple.first)   
    |> Result.map ( 
          List.map (
            \(n , lst)->
                div [ctxCellsRowStyle] [
                    --  h2 [] [text (String.fromInt n)]
                    -- ,
                     div [] (lst |> List.map (Tuple.second >> div [ctxCellStyle]))
                    ]
                   ))   
    -- |> Result.map (List.map (div [ctxCellStyle]))
    |> Result.map (\rows -> 
                             toolBoxWin
                             "generated generic arguments"
                             (div [] rows)
                           )
    |> describeErr ("ctxHtml")     


       


fwCol : Int -> Int -> List (Html msg) -> Html msg
fwCol l w = div [
           css [
              width (vw (toFloat w))
              , left (vw (toFloat l))    
              , height (vh 100)
              , position absolute    
            ]
          ]

type alias InspectorModel = {}    

initInspectorModel : InspectorModel
initInspectorModel = {}

fullWindow : List (Html msg) -> Html msg
fullWindow = div [css [
                    position fixed
                    , property "display" "flex"
                    -- , flexWrap wrap    
                    , width (vw 100) , height (vh 100) , top (px 0) , left (px 0)
                    , zIndex (int 1000) , backgroundColor (rgb 255 255 255)
                    -- , overflow auto    
                  ]]
                     
vizHtmlWindow : (Maybe Address) -> Result String ((C.CType , I.Term) , Maybe AllWorkType)
                 -> Html (Maybe Address , Maybe AllWorkType)
vizHtmlWindow mba =
      let bigCanvasSize = 1024
          
      in
      Result.andThen (\((ct , tm ) , mbDone) ->
         (case mbDone of
             Just x -> Ok x
             Nothing -> allWork (ct , tm))             
         
         |> Result.andThen (\(dc , n , (cn2 , drw0)) ->
                [
                  Ok 
                      [
                         lazyResHtml signatureVizHtml dc
                       , lazyResHtml boundariesVizHtml ((n , ct) , dc)      
                       , lazyResHtml
                                 (\((mbaA , dcA) , (nA , cn2A)) -> codeVizHtml mbaA dcA nA cn2A )
                                 ((mba , dc) , (n , cn2)) 
                       , lazyResHtml ctxHtml dc

                           
                      ]
                  |> Result.map (
                     div [css [
                             -- paddingLeft (px bigCanvasSize)
                             -- ,
                             -- position relative , top (px 0) , left (px 0)
                             minWidth (px 250)
                            , overflow auto
                            , height (pct 100)     
                          ]])
                ,
                  inspectorCanvas mba bigCanvasSize n cn2 drw0 |> Ok
                      |> Result.map (List.singleton >>
                     div [css [
                            -- position absolute , top (px 0) , left (px 0) 
--                              maxWidth (vw 100)
--                              , maxHeight (vh 100)
                              --,
                                  -- minWidth (px  bigCanvasSize)
                                    height (px  bigCanvasSize)
                                  , minWidth (px  bigCanvasSize)    
                                  ,
                                  position relative    
                          ]])
                ] |> List.reverse
               |> mapListResult (identity)
               |> Result.map (
                     fullWindow
                     >> map (pairR (Just (dc , n , (cn2 , drw0))) )
                             )                 
                                
   )) >> convergeResult
        (\s -> (node "pre" [] [text s]) |> map (pairR Nothing) )
        (identity) 


            
vizSmallPrev : Int -> (C.CType , I.Term) -> Maybe (List (Html msg))
vizSmallPrev vizPrevIconSize =
    let 
            
        vizPrevS : DrawingHTMLSettings
        vizPrevS = { defCanvSet | width = vizPrevIconSize , height = vizPrevIconSize }
    in
    (\(ct , tm ) ->
         allWork (ct , tm)
         |> Result.andThen (\(dc , n , (_ , drw0)) ->                
                  handleDifrentDims [] vizPrevS n drw0
                                
   )) >> Result.map (List.singleton)
      >> Result.toMaybe                



boundariesHtml : ((Int , C.CType) , DCtx) -> Result String (Html (Maybe Address))
boundariesHtml ((n , ct) , dc) =
   let (cuC , cuTy) =  C.toCubical C.emptyCtx ct

       sizeShort = 32
       sizeLong = 162               
                       
       faceStyle : Face -> (List Style , List Style) 
       faceStyle (i , b) =
           case n of
               2 ->
                 case i of
                     0 -> ([width (px sizeShort) , height (px sizeLong)]
                          , [
                              left (px (choose b 0 (sizeShort + sizeLong)))
                              , top (px sizeShort)    
                            ])
                     _ -> ([width (px (sizeLong)) , height (px sizeShort)]
                          , [
                              top (px (choose b 0 (sizeShort + sizeLong)))
                              , left (px sizeShort)    
                            ])   
               _ -> ([] , [])
                    
   in
   allFaces n
   |> mapListResult (\(i , b) ->
                      contextualizeFace dc n (i , b) cuTy
                      
                      |> Result.andThen (termHtmlSimple (faceStyle (i , b) |> Tuple.first) 128)
                      |> ((dimIndexToName dc (DimIndex i)
                          |> Result.fromMaybe ("unable to get Index name")
                          
                          )                         
                      |> Result.map2 (\dimName -> \fceHtml ->
                            div [faceStyle (i , b) |> Tuple.second
                                |> List.append [ position absolute]
                                |> css] [
                                  span []
                                      [
                                        span [] [text "("]
                                      , span [] [text (dimName)]
                                      , span [] [text " = "]
                                      , span [] [text (choose b "i0" "i1")]
                                      , span [] [text ")"]
                                      ]
                                  , fceHtml
                                ]
                           )
                     ))
   |> Result.map (div [css [position relative , height (px (3 * sizeShort + sizeLong))]])    
       
boundariesVizHtml : ((Int , C.CType) , DCtx) -> Result String (Html (Maybe Address))
boundariesVizHtml =
       boundariesHtml
    >> Result.map (\x -> toolBoxWin "constraints"
                       (
                         div [css [
                               fontFamily monospace
                              , padding (px 4) 
                              ]] [x]
                       ) 
                   )                                 
          
