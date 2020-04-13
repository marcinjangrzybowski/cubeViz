module MicroAgda.Viz.CodeViz exposing (..)

import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T
import MicroAgda.Internal.TranslatePretty as TP

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
import  MicroAgda.Viz.Process exposing (..)

import Css exposing (..)
import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css, href, src)
import Html.Styled.Events exposing (onClick , on , stopPropagationOn )

import Gui.Draw exposing (..)

import Json.Decode as JD


hoverAlpha = 0

hoverStyle = [border3 (px 1) solid (rgba 0 0 0 0) , hover [border3 (px 1) solid (rgb 0 0 0) ]]

selectedStyle : Maybe Address -> Address -> List Style              
selectedStyle mbAddr addr = 
    ((if (mbAddr == Just addr)
    then [color (rgb 255 0 0)]
    else []) ++ [cursor pointer]    
    )
-- ++ hoverStyle
    
selectEvent adrs =
    stopPropagationOn "click"
        (JD.succeed (Just adrs , True))
        
    -- onWithOptions "mouseDown"
    --     { stopPropagation = True
    --     , preventDefault = True }
    -- (Just (adrs))

--onWithOptions "keydown" options 

selectable : Maybe Address -> Address -> List (Attribute (Maybe Address))
               -> List (Html (Maybe Address)) -> Html (Maybe Address)
selectable mbAdr adrs s elems =
    div
    ([selectEvent adrs , css (selectedStyle mbAdr adrs)  ] ++ s)
        elems
             
collectCubHtml : Maybe Address -> Address -> (DCtx , Int , Cub (Html msg)) -> Html (Maybe Address)
collectCubHtml mba adrs (dc , n , cH) =
    let

        hcompHeadCss = css []

        hcompInsideCss = css [paddingLeft (px 10)]
                       
        hcompSidesCss = css ([
                           
                        ])

        hcompCupCss = css []                 

        hcompSubFaceDescCss = css [
                               display inlineBlock
                               , verticalAlign top    
                              ]

        hcompSubFaceBodyCss = css [
                              display inlineBlock     
                             ]
                              
        sf2Str : SubFace -> Html (Maybe Address)
        sf2Str sf =
               subFaceLI.toL sf
               |> List.indexedMap ( \x -> \mb ->
                                   C.lookNameByInt (toCtx dc) (fromDimIndex dc (DimIndex x))
                                   |> Maybe.map2 (\b -> \name ->  ((name , x) , b) ) mb
                                  )
               |> List.filterMap identity    
               |> List.map (\((name , i) , b) ->
                                "(" ++ name
                                ++ " = "
                                ++ (choose b "i0" "i1")
                                ++ ")"
                           )
               |> String.join ("") |> (\x -> x ++ " → ") |> text |> List.singleton
               |> div [hcompSubFaceDescCss] 
            
                
        sfHtml : String -> SubFace -> Cub (Html msg) -> Html (Maybe Address)
        sfHtml vName sf sideBody =
             (mkBoundSF dc sf) |> Result.map (\dc2 ->
                     let
                         dc3 = extendI dc2 vName
                         n3 = dimOfCtx dc3
                     in
                         selectable
                           mba
                           (adrs ++ [sf]) [css ([])]
                            [
                            sf2Str sf   
                           , div [hcompSubFaceBodyCss] [
                                  collectCubHtml mba (adrs ++ [sf]) (dc3 , n3 , sideBody)
                                ]
               
                              ]
                      ) |> Result.withDefault (text "printingCodeErr")
            
 
-- collectCubHtml (dc , n , bd)
        -- _ = log "x" (dc.list |> List.map (\(x , _ , _) -> x))
                        
    in
    case cH of
        Cub tm x -> map (const Nothing) x
        Hcomp tm vName sides cup ->
           
            let sidesHtml = 

                      tabulateSubFaces n sides
                      |> List.map (\(sf , bd) ->
                                     (sfHtml vName sf bd)
                                  )

            in
            selectable mba adrs [] (
                [div [hcompHeadCss] [text ("hcomp (λ "  ++ vName ++ " → λ { " )] ] 
                 ++
                ([div [hcompInsideCss] (
                  [ div [hcompSidesCss] sidesHtml ]
                ++
                [ div [] [text "})"]]      
                ++ [ selectable
                         (mba)
                         (adrs ++ [subFaceCenter n])
                         [ hcompCupCss ]
                         [collectCubHtml mba (adrs ++ [subFaceCenter n]) (dc , n , cup)]]
                  )])

               
             )
        

genHtml : Maybe Address -> DCtx -> Int -> I.Term -> Address -> N2
            -> Result String (Html (Maybe Address))
genHtml mba dc n tm addr n2 =
    let txt = TP.t2str (toCtx dc) tm
              |> text
     in            
     
       div [
            --  onClick (Just addr)
            -- ,
            css ([
               
             ] )
           ]
           [txt]
      |> Ok
       
codeVizHtml : Maybe Address -> DCtx -> Int -> Cub N2 -> Result String (Html (Maybe Address))
codeVizHtml mba dc n cn2 =
    stepMap (genHtml mba) (Ok (dc , n , cn2))
    |> Result.map (collectCubHtml mba [])
    |> Result.map (\x -> div [css [fontFamily monospace]] [x] )   
