module TestRun exposing (..)

import Browser exposing (Document)



import Css exposing (..)
import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css, href, src)
import Html.Styled.Events exposing (onClick)


import Set 
import Parser exposing (Parser, (|.), (|=), succeed, symbol, float, spaces, oneOf , lazy , variable , andThen)

import ParserHelp exposing (..)

import Parser.Advanced as A

import Maybe exposing (Maybe , withDefault)

import Platform.Cmd

import MicroAgda.Parser exposing (mainParser)
import MicroAgda.ParserTests as PT
import MicroAgda.Raw as Raw

import Gui.Code exposing (..)

import ResultExtra exposing (..)

main =
  Browser.document {
          init = init,
          update = update,
          subscriptions = subscriptions,
          view = view
      }

type Msg = LoadCode String
                        

                        
update msg model =
  (model , Cmd.none)

              
type alias Model = { testResults : List (PT.ParseTCase , PT.ParseTCaseResult) }
    
init : () -> (Model, Cmd Msg)    
init flags = ( { testResults = PT.runTests } , Cmd.none )
    
subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none     

        
        
tRes2HTML : (PT.ParseTCase , PT.ParseTCaseResult) -> Html Msg
tRes2HTML z =
    let s = if (expectedQ (Tuple.second z) == (Tuple.first z).asume) then greenBorder else redBorder in 
    case z of
        (c , Ok code) -> div [  s ] [ node "pre" [] [text c.content]  , node "pre" [] [ text (Raw.raw2String code.parsed) ] ]            
        (c , Err msg) -> div [ s ] [
                                             node "pre" [] [text c.content]
                                           , div [] (List.map (deadEnd2Html c.content) msg.msgRaw)
                                           , text msg.msg
                                           ]

viewHtml : Model -> Html.Html Msg                 
viewHtml model =
    
    toUnstyled ( div [] (List.map tRes2HTML model.testResults) )
                         
view model =
  { title = "MicroAgda - Tests" ,
    body = [ viewHtml model ]     
     
   }
