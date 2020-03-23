module Main exposing (..)

import Browser exposing (Document)

import Css exposing (..)
import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css, href, src)
import Html.Styled.Events exposing (onClick)

import Dict
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

import MicroAgda.File exposing (..)
import MicroAgda.SampleFiles exposing (..)

import ResultExtra exposing (..)
import Gui.Code exposing (..)

import Task

import Debug exposing (..)

--import MicroAgda.Viz exposing (..)

import Gui.Draw exposing (..)

main =
  Browser.element {
          init = init,
          update = update,
          subscriptions = subscriptions,
          view = view
      }

type Msg = LoadFile UnParsedFile | ReadFile String
    
update msg model =
  case msg of
      LoadFile upf ->
          let (file , mbC) = readFile upf in
          let cm =
                  ("file " ++ (getFileName file) ++  " loaded \n") ++
                  (mbC |> Maybe.map  (\_ -> "Ok!") |> Maybe.withDefault ("Error!"))  
          in
          ({ model | file = Just file ,
                 msg = cm , context = mbC} , Cmd.none)
      ReadFile upfName ->
          
                    Dict.get upfName sampleFiles
                 |> Maybe.map (\upf -> (model , loadFileTask upf))       
                 |> Maybe.withDefault ({model | msg = "unable to load :" ++ upfName} , Cmd.none)
                    
--          (model , Cmd.none)
  

              
type alias Model = { 
                     file : Maybe (File ())
                   , context : Maybe C.Ctx
                   , msg : String            
                   }



    
    
init : () -> (Model, Cmd Msg)    
init flags = ( { 
                file = Nothing
               , context = Nothing
               , msg = "initial msg" } ,
                 readFileTask ("prelude")
             )

loadFileTask : UnParsedFile -> Cmd Msg
loadFileTask upf = Task.perform identity (Task.succeed (LoadFile upf))

readFileTask : String -> Cmd Msg
readFileTask upf = Task.perform identity (Task.succeed (ReadFile upf))                   

-- parseFileTask : Cmd Msg
-- parseFileTask = Task.perform identity (Task.succeed (ParseFile))
               
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

emptyFileView : Html Msg
emptyFileView = div [] [text "nothing is loaded"]            

fileDiv : List (Html Msg) -> Html Msg
fileDiv l = div [] l            

fileView : Model -> Html Msg                 
fileView model =
   -- model.unParsedFile    
   -- |> Maybe.map (unparsedFile2defList >> List.map unparsedDefinition2Html >> fileDiv)
   model.file
    |> Maybe.map (file2Html)    
    |> Maybe.withDefault (emptyFileView)

consoleView : Model -> Html Msg
consoleView model = div [] [text model.msg ]              

fileSelector : Model -> Html Msg
fileSelector model = div [] (List.map (\fname ->

                                           let isNow =
                                                 (model.file)
                                                 |> Maybe.map (\f -> getFileName f == fname)
                                                 |> Maybe.withDefault False in
                                           let s = if isNow then [textDecoration underline ] else [] in
                                           div [
                                               css (List.append [
                                                display inlineBlock
                                               , margin (px 3)
                                               , cursor pointer     
                                                   ] s)
                                                , onClick ( ReadFile fname )
                                                   
                                                  ] [text fname]) (Dict.keys sampleFiles)) 

                    
viewHtml : Model -> Html Msg                 
viewHtml model = div [] [
                    fileSelector model
                   , fileView model
                   , consoleView model     
                  ]
   
    
    -- toUnstyled ( div [] (List.map
    --                          (convergeResult
    --                               (\s -> div [] [text ("bad test: "++ Tuple.first s)] )
    --                               tRes2HTML)
    --                          model.testResults
    --                     ) )


               
view model =
  --{ --title = "MicroAgda - File" ,
    --body =
       Html.div []
        [ toUnstyled (viewHtml model) , Html.div [] [ canvasTest ] ]     
     
   --}
