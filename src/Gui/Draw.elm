module Gui.Draw exposing (..)


import Html exposing (..)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)

import Color

import Set 

import Maybe exposing (Maybe , withDefault)

import Debug exposing (..)

import MicroAgda.Drawing exposing (..)


import ResultExtra exposing (..)


import Canvas exposing (..)
import Canvas.Settings exposing (..)


circle : (Float -> Float -> Color.Color)
circle x y = if (x*x + y*y > 0.5) then Color.red else Color.yellow

rasterSizeDef = 128
             
canvasTest : Html msg
canvasTest = 
    let
        width = 512
        height = 512
    in
        Canvas.toHtml (width, height)
            [ style "border" "1px solid black" ]
            (List.append [ shapes [ fill Color.white ] [ rect (0, 0) width height ] ]
                (rasterize width height rasterSizeDef circle))



rasterizeHTML : (Float -> Float -> Color.Color) -> Html msg
rasterizeHTML f =
    let
        width = 512
        height = 512
    in
        Canvas.toHtml (width, height)
            [ style "border" "1px solid black" ]
            (List.append [ shapes [ fill Color.white ] [ rect (0, 0) width height ] ]
                (rasterize width height rasterSizeDef f))                


curry2f : ((Int -> Float) -> Color.Color) -> (Float -> Float -> Color.Color)
curry2f ucf x y =
    ucf (\i -> case i of
                    0 -> x
                    1 -> y
                    _ -> 0)
          
rasterHTML : ((Int -> Float) -> Color.Color) -> Html msg
rasterHTML =
    curry2f >> rasterizeHTML 

                
rasterize : Int -> Int -> Int -> (Float -> Float -> Color.Color) -> List Renderable 
rasterize wI hI rs fn =
    let rn = (List.range 0 (rs - 1)) in
    let frs = (toFloat rs) in
    let w = ((toFloat wI)) in
    let h = ((toFloat hI)) in 
    List.concat (
              List.map (\xI -> List.map ( \yI ->
                                         let x = ((toFloat xI)/frs) in
                                         let y = ((toFloat yI)/frs) in   
                                         let color = fn x y in     
                                         shapes [ fill (color) ]
                                            [ rect (x * w , y * h) (w / frs) (h / frs) ] 
                                       ) rn ) rn
                )

--  [
   -- shapes [ fill (Color.rgba 0 0 1 1) ]
   --    [ rect (50, 50) 20 10 ]
   -- ,
   --   shapes [ fill (Color.rgba 1 0 1 1) ]
   --    [ rect (100, 100) 100 50 ]
   --     ]
            
renderSquare =
  shapes [ fill (Color.rgba 1 0 0 1) ]
      [ rect (100, 100) 100 50 ]             


type alias DrawingHTMLSettings = { width : Int , height : Int , bgColor : Maybe Color.Color }


defaultDrawingHTMLSettings = { width = 1024 , height = 1024 , bgColor = Just Color.white }

defCanvSet = defaultDrawingHTMLSettings
                             
drawingHTML : Maybe DrawingHTMLSettings -> (Drawing MetaColor) -> Html msg
drawingHTML =
    Maybe.withDefault defaultDrawingHTMLSettings >>
    (\ds ->    

           let
               width = ds.width
               height = ds.height

               bgshp = ds.bgColor |>
                       Maybe.map (\x -> [ shapes [ fill (x) ]
                                  [ rect (0, 0) (toFloat width) (toFloat height) ] ])
                       |> Maybe.withDefault []

           in         
       pxScale (width , height) >> toRenderableAll >>
       (\rls ->

           Canvas.toHtml (width, height) 
               [ style "width" "100%" , style "heigth" "100%" ]
               ([clear ( 0, 0 ) (toFloat width) (toFloat height)] ++ 
               (List.append
                    bgshp
                   (
                     rls
                   ))              )  
        )
    )

    
