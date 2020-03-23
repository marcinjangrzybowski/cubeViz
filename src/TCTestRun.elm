module TCTestRun exposing (..)

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
import MicroAgda.TCTests as TCT
import MicroAgda.Raw as Raw
import MicroAgda.Internal.Ctx as C 
import MicroAgda.Internal.Translate as T

import ResultExtra exposing (..)
import Gui.Code exposing (..)

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

              
type alias Model = { testResults : List (Result (String , TCT.TCTCase) (TCT.TCTCase , TCT.TCTCaseResult)) }
    
init : () -> (Model, Cmd Msg)    
init flags = ( { testResults = TCT.runTests } , Cmd.none )
    
subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none     



        
tRes2HTML : (TCT.TCTCase , TCT.TCTCaseResult) -> Html Msg
tRes2HTML z =
    let s = if (expectedQ (Tuple.second z) == (Tuple.first z).assume) then greenBorder else redBorder in 
    case z of
        (c , Ok res ) -> div [  s ] [
--                                   node "pre" [] [text c.content]
                                   node "pre" [] [ text (T.ct2str C.emptyCtx res.ctype) ] 
                                 , node "pre" [] [ text (Raw.raw2String res.rawTerm) ] 
                                 , node "pre" [] [ text (T.t2str C.emptyCtx res.internalTerm) ]
                                     ]    
        (c , Err msg) -> div [ s ] [
                                             node "pre" [] [text c.content]
                                           , node "pre" [] [text msg.msg]
                                           --, text msg.msg
                                           ]
                 
viewHtml : Model -> Html.Html Msg                 
viewHtml model =
    
    toUnstyled ( div [] (List.map
                             (convergeResult
                                  (\s -> div [] [text ("bad test: "++ Tuple.first s)] )
                                  tRes2HTML)
                             model.testResults
                        ) )
                         
view model =
  { title = "MicroAgda - Tests" ,
    body = [ viewHtml model ]     
     
   }
