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

import MicroAgda.Drawing exposing (..)

import Color exposing (..)

import MicroAgda.Viz exposing (..)
import MicroAgda.VizInterpreters exposing (..)
import MicroAgda.RasterInterpreter exposing (..)
import MicroAgda.VectorInterpreter exposing (..)

import Gui.Draw exposing (..)

main =
  Browser.element {
          init = init,
          update = update,
          subscriptions = subscriptions,
          view = view >> toUnstyled
      }

type Msg = LoadFile UnParsedFile | ReadFile String | ShowDiagram String
    
update msg model =
  case msg of
      
      LoadFile upf ->
          let (file , mbC) = readFile upf in
          let cm =
                  ("file " ++ (getFileName file) ++  " loaded \n") ++
                  (mbC |> Maybe.map  (\_ -> "Ok!") |> Maybe.withDefault ("Error!"))  
          in
          ({ model | file = Just file ,
                 showName =
                            -- "compPath-filler"
                               List.reverse (defsNames file)
                            |> List.head
                            |> Maybe.withDefault ""
                 , msg = cm , context = mbC} , Cmd.none)
      ReadFile upfName ->
          
                    Dict.get upfName sampleFiles
                 |> Maybe.map (\upf -> (model , loadFileTask upf))       
                 |> Maybe.withDefault ({model | msg = "unable to load :" ++ upfName} , Cmd.none)
      ShowDiagram defName -> ( {model | showName = defName} , Cmd.none)              
--          (model , Cmd.none)
  

              
type alias Model = { 
                     file : Maybe (File ())
                   , context : Maybe C.Ctx
                   , msg : String
                   , showName : String        
                   }



    
    
init : () -> (Model, Cmd Msg)    
init flags = ( { 
                file = Nothing
               , context = Nothing
               , msg = "initial msg"
               , showName = "compPath"
             } 
               ,  readFileTask ("assoc")
               
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

defSelector : Model -> Html Msg
defSelector model =
    model.file
   |> Maybe.map (definedDict)
   |> Maybe.map (
         Dict.toList
        >> List.map (\(name , def) ->
                 let s =
                         if name == model.showName
                         then [textDecoration underline ] else []
                 in        
                     div [
                         css (List.append [
                           display inlineBlock
                          , margin (px 3)
                          , cursor pointer     
                              ] s)
                           , onClick ( ShowDiagram name )

                             ] [text name]       
                )

                )      
   |> Maybe.withDefault ([])   
   |> div []                 

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


vizHtml : Interpreter a -> (a -> Html msg) -> Model -> Html msg
vizHtml ipr rendr model =
    model.file
    |> Result.fromMaybe ("no file")    
    |> Result.andThen (defByName model.showName >> Result.fromMaybe ("def not found"))  
    |> Result.andThen (interpretExpr ipr)
    |> Result.map rendr
    |> convergeResult (\s -> div [] [text ("error!" ++ s) ]) identity                   

-- type alias CurrentInterpreterTy = ()

    
--currentInterpreter : (Interpreter cit , Maybe (cit -> Html msg))
currentInterpreter =
    --(dullIPR , Nothing) 
    -- (prerenderIPR , Nothing)
    -- (fillRasterIPR , Just (rasterHTML >> fromUnstyled))
    -- (rasterIPR , Just (rasterHTML >> fromUnstyled))
    (vCellOutlineIPR , Just (countColorize >> drawingHTML >> fromUnstyled))

        
drawnHtml : Model -> Html msg
drawnHtml model =
    let (itr , rendr) = currentInterpreter in
    vizHtml itr (Maybe.withDefault (itr.toStr 0 >> (\s -> node "pre" [] [text s] )) rendr) model
                 
view model =
  --{ --title = "MicroAgda - File" ,
    --body =
       div []
        [  (viewHtml model) ,
              div [] [
                   defSelector model 
                  , drawnHtml model ] ]     
     
   --}
