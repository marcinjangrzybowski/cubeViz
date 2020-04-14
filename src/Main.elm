port module Main exposing (..)

import Browser exposing (Document)

import Browser.Dom exposing (..)
import Browser.Events as BE

import Css exposing (..)

import Url exposing (..)

import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css, href, src)
import Html.Styled.Events exposing (onClick)
import Html.Styled.Lazy exposing (..)


import Dict
import Set 

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


-- import MicroAgda.VizInterpreters exposing (..)
-- import MicroAgda.RasterInterpreter exposing (..)
-- import MicroAgda.VectorInterpreter exposing (..)

import MicroAgda.Viz.Gui exposing (..)
import MicroAgda.Viz.Structures exposing (Address , AllWorkType)

import Gui.Draw exposing (..)

main =
  Browser.element {
          init = init,
          update = update,
          subscriptions = subscriptions,
          view = view >> toUnstyled
      }

type Msg =
     LoadFile UnParsedFile
   | ReadFile String
   | ShowDiagram String
   | ExitFullScreen
   | FromWindow (Maybe Address) (Maybe AllWorkType)  
   | GotNewInspectorSize (Maybe (Float , Float))
   | UpdateInspectorSize 
     
port setLocHash : String -> Cmd msg

update :  Msg -> Model -> ( Model , Cmd Msg )                  
update msg model =
  (case msg of
      
      LoadFile upf ->
          let (file , mbC) = readFile upf in
          let cm =
                  ("file " ++ (getFileName file) ++  " loaded \n") ++
                  (mbC |> Maybe.map  (\_ -> "Ok!") |> Maybe.withDefault ("Error!"))
          in
          ({ model | file = Just file 
                 , msg = cm , context = mbC} , Nothing)
      ReadFile upfName -> 
                    Dict.get upfName sampleFiles
                 |> Maybe.map (\upf -> (model , Just (loadFileTask upf)))       
                 |> Maybe.withDefault ({model | msg = "unable to load :" ++ upfName} , Nothing)
      ShowDiagram defName -> ( {model |
                                 showName = defName
                               , fullScreenMode = True
                               , selectedAddress = Nothing
                               , cachedWinWork = Nothing
                               }
                              , Just (
                                       updateInspectorSizeTask
                                     ))
      ExitFullScreen -> ( {model | fullScreenMode = False }
                              , Nothing)
      FromWindow mbAddrs mbCache ->
                           -- let _ = log "xx" mbAddrs in
                           ( {model | selectedAddress = mbAddrs , cachedWinWork = mbCache }
                              , Just (updateInspectorSizeTask) )
      UpdateInspectorSize -> (model , Just (
                                   getElement "inspectorBox"
                                 |> Task.attempt (
                                      convergeResult (const (Nothing))
                                          (\inf ->
                                               Just (inf.element.width , inf.element.height))
                                          >> GotNewInspectorSize
                                                 )
                                 )  
                              )  
      GotNewInspectorSize mbWH ->
          -- let insS = log ("mbWH") (mbWH)
          -- in
            ({ model | inspectorSize = mbWH}  , Nothing) 
    ) |> (\(m , c) -> (m , c |> Maybe.withDefault (setLocHash (model2hash m))))
                        
--          (model , Cmd.none)
  

              
type alias Model = { 
                     file : Maybe (File ())
                   , context : Maybe C.Ctx
                   , msg : String
                   , showName : String
                   , fullScreenMode : Bool
                   , selectedAddress : Maybe Address
                   , inspectorModel : InspectorModel
                   , cachedWinWork : Maybe AllWorkType
                   , inspectorSize : Maybe (Float , Float)                  
                   }

model2hash : Model -> String
model2hash m =
    case (m.file) of
        Just fname -> if (m.fullScreenMode)
                      then (getFileName fname) ++ "," ++ m.showName
                      else (getFileName fname)    
        Nothing -> ""
    
init : String -> (Model, Cmd Msg)    
init flags =
             ( { 
                file = Nothing
               , context = Nothing
               , msg = "initial msg"
               , showName = ""
               , fullScreenMode = False
               , selectedAddress = Nothing
               , inspectorModel = initInspectorModel
               , cachedWinWork = Nothing
               , inspectorSize = Nothing                 
             } 
               ,  newHashToCmd flags
               
             )

newHashToCmd : String -> Cmd Msg
newHashToCmd = String.dropLeft 1 >>
    String.split "," >> (\l ->
      case l of
          [fName] -> readFileTask (fName)
          [fName , defName] ->  readFileAndShowTask fName defName
          _ -> Cmd.none                             
    )


-- showInspectorTask : String -> Cmd Msg
-- showInspectorTask = todo ""
                   
loadFileTask : UnParsedFile -> Cmd Msg
loadFileTask upf = Task.perform identity (Task.succeed (LoadFile upf))

readFileTask : String -> Cmd Msg
readFileTask upf = Task.perform identity (Task.succeed (ReadFile upf))

setInspectedDefName : String -> Cmd Msg
setInspectedDefName defName = Task.perform identity (Task.succeed (ShowDiagram defName))  

updateInspectorSizeTask = Task.perform identity (Task.succeed UpdateInspectorSize)
                              
readFileAndShowTask : String -> String -> Cmd Msg
readFileAndShowTask fName defName =
    Cmd.batch [ readFileTask fName , setInspectedDefName defName ]

-- parseFileTask : Cmd Msg
-- parseFileTask = Task.perform identity (Task.succeed (ParseFile))
               
subscriptions : Model -> Sub Msg
subscriptions model =
    -- BE.onAnimationFrame (\_ -> UpdateInspectorSize)  
  BE.onResize (\_ _ -> UpdateInspectorSize)     
-- GotNewInspector


        
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

fileView : Maybe (File ()) -> Html Msg                 
fileView file =
   -- model.unParsedFile    
   -- |> Maybe.map (unparsedFile2defList >> List.map unparsedDefinition2Html >> fileDiv)
       file
    |> Maybe.map (file2Html (vizSmallPrev) { onIconClick = ShowDiagram } )    
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

   
    
    -- toUnstyled ( div [] (List.map
    --                          (convergeResult
    --                               (\s -> div [] [text ("bad test: "++ Tuple.first s)] )
    --                               tRes2HTML)
    --                          model.testResults
    --                     ) )



-- type alias CurrentInterpreterTy = ()


        

drawnHtmlWindow : Model -> Html Msg
drawnHtmlWindow model =
                       model.file
                    |> Result.fromMaybe ("no file")    
                    |> Result.andThen (
                            defByName model.showName
                         >> Result.fromMaybe ("def not found")
                         >> Result.map (pairR model.cachedWinWork) 
                                      )  
                    |> vizHtmlWindow (model.selectedAddress)
                    |> Html.Styled.map (\(mbA , cache) ->
                                            FromWindow mbA cache
                                         
                                       )
                       
    -- in convergeResult (\s -> node "pre" [] [text s] ) (drawingHTML  >> fromUnstyled) vizResult         

fullScreenView : Model -> Html Msg -> Html Msg -> Html Msg
fullScreenView model appHtml winHtml =
    let appCss = if model.fullScreenMode then [display none] else []
        exitBtn = div [
                   css [ position fixed , zIndex (int 2000) , top (px 5)
                       , right (px 5) , height (px 20)
                       , padding (px 5)
                       , fontSize (px 16)    
                       , backgroundColor (Css.rgb 255 255 255)
                       , cursor pointer
                       , border3 (px 1) dotted (Css.rgb 0 0 0)
                       ]
                  , onClick ( ExitFullScreen )] [text "↩ back to file"]         
        wHtml = if model.fullScreenMode then [winHtml , exitBtn] else []            
    in
    div [] ([
            div [css appCss] [appHtml]          
         ] ++ wHtml )
                 
view model =
  --{ --title = "MicroAgda - File" ,
    --body =

           fullScreenView model
              (div [] [
                    fileSelector model                     
                  , defSelector model                    
                  -- , drawnHtmlOld model      
                  , lazy fileView model.file
                  , consoleView model 
                  ])
              (drawnHtmlWindow model) 
             
     
   --}
