module Gui.Code exposing (..)

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
import MicroAgda.Raw as R
import MicroAgda.Internal.Ctx as C 
import MicroAgda.Internal.Translate as T

import Debug exposing (..)

import MicroAgda.File exposing (..)

import ResultExtra exposing (..)

green : Color
green = (rgb 0 128 0)

red = (rgb 128 0 0)        
black = gray 0

      
testCaseCss = [ margin (px 5) , fontSize (px 9) , padding2 (px 2) (px 9) ]
      
greenBorder : Attribute msg
greenBorder =
    css (( border3 (px 2) solid green ) :: (backgroundColor (rgb 220 255 220)) ::  testCaseCss ) 

redBorder : Attribute msg
redBorder =
    css (( border3 (px 2) solid red ) :: testCaseCss)         

lookupDef : a -> Int -> List a -> a
lookupDef d i xs =
    case xs of
        [] -> d
        x :: xxs ->
            if i < 1 then x else (lookupDef d (i - 1) xxs) 
        
getLine : Int -> String -> String
getLine i s =
    let lines = String.split "\n" s in
    lookupDef "" i lines
    
        
deadEnd2Html : String -> Parser.DeadEnd ->  Html msg
deadEnd2Html code de =
    div [  css (( border3 (px 2) solid red ) :: [])  ]
        [
            node "pre"
                [ css [ ] ]
                [ text (getLine (de.row - 1) code ) ]
          , node "pre"
                [ css [ marginTop (px -13) , color red ] ]
                [text ((String.repeat (de.col - 1) " ") ++ "◣" ) ]
        ]

-- unparsedDefinition2Html : UnParsedDefinition -> Html msg 
-- unparsedDefinition2Html (UnParsedDefinition upd) =
--     div []
--         [node "pre" [] [text (
--            upd.name ++ " : " ++ upd.signature ++ "\n" ++
--            upd.name ++ " "  ++ (String.join " " upd.args) ++ " = " ++ upd.body    
--         ) ]
--         ]
        
-- rawDefinition2Html : RawDefinition -> Html msg 
-- rawDefinition2Html (RawDefinition rd) = div []
--         [node "pre" [] [text (
--            rd.name ++ " : " ++ (R.raw2String rd.signature) ++ "\n" ++
--            rd.name ++ " "  ++ (String.join " " rd.args) ++ " = " ++ (R.raw2String rd.body)    
--         ) ]
--         ]



parsedDef2Html : (d -> Html msg) -> ParsedDefinition d -> Html msg
parsedDef2Html ped def = node "pre" [] [text (getName def)] 

parseErrorDef2Html : (d -> Html msg) -> ParseErrorDefinition d -> Html msg
parseErrorDef2Html f =
       tryParsedError
    >> Result.map (parsedDef2Html f)
    >> Result.mapError (\def -> node "pre" [] [text ("pe " ++ getName def)] )
    >> resolvedResult    

tcErrorDef2Html : ((Maybe C.Ctx , d) -> Html msg) -> TCErrorDefinition d -> Html msg
tcErrorDef2Html f =
    tryTCError
    >> Result.map (tcDef2Html (\(c , d) -> f (Just c , d)))
    >> Result.mapError (\def -> node "pre" [] [text ("tce " ++ getName def)] )
    >> resolvedResult                         



        
tcDef2Html : ((C.Ctx , d) -> Html msg) -> TCDefinition d -> Html msg
tcDef2Html ped = (\def -> node "pre" [] [
                           text (" ok " ++ getName def)
                          ] )

gray : Int -> Color
gray x = rgba x x x 255       
                 
def2HtmlWT : (d -> Html msg) -> ( (d -> Html msg) ->  Definition a b d -> Html msg)                 
                 -> Definition a b d -> Html msg
def2HtmlWT f ff def = div [
                        css [ position relative ] 
                      ] [ div [
                            css [ position relative
                                , backgroundColor (gray 240)
                                ,  marginTop (px 3)
                                --,  paddingTop (px 1)   
                                ]
                          ] [ ff f def ]
                             , div [css [ marginLeft (px 20) ] ] (getTail def
                                      |> List.map (def2HtmlWT f ff ))]  




                      
def2Html : (d -> Html msg) -> MADefinition d -> Html msg
def2Html f =
    convergeResult
    (convergeResult
       (def2HtmlWT f parseErrorDef2Html)
       (def2HtmlWT (\(c , d) -> f d) tcErrorDef2Html) 
    )
    (def2HtmlWT (\(c , d) -> f d) tcDef2Html)





dummy : d -> Html msg        
dummy _ = div [] []
-- file2Html : File () -> Html msg
-- file2Html (File name l) = div []
--                           ( (List.map (def2Html (\_-> div [] [])) l ))            

codeCss : List Style
codeCss = [ fontSize (px 12) ]          

unParsed2Html : (d -> Html msg) -> UnParsedDefinition d -> Html msg
unParsed2Html f = def2HtmlWT  f (\_ -> \x -> node "pre" [ css (List.append codeCss [color green]) ] [ text (unParseDef x)])


def2HeadCode : MADefinition d -> Html msg
def2HeadCode x = node "pre" [ css codeCss ] [ text (unParseDef (madToUnParsed x))]                   

errBox : (Result (String , List Parser.DeadEnd) String) -> Html msg                  
errBox =
    convergeResult
        (\(code , el) -> (div [] (List.map (deadEnd2Html code) el)))
        (\estr -> div [] [text estr])    
        
                  
simpleDef2Html :  MADefinition d -> Html msg 
simpleDef2Html def =
    let h0 = [def2HeadCode def]
            |> div [ css [position relative
                     , backgroundColor (gray 240)
                     ,  marginTop (px 3)] ]            
    in
    let h =
            def
           |> Result.map (\tcd -> [h0 , unParsed2Html dummy (unParseTC tcd) ]  )
           |> Result.withDefault [h0] in   
    let tl =
            List.map simpleDef2Html (getMADTail def)
            |> div [css [ marginLeft (px 20) ] ]
    in
    extractErr def
    |> Maybe.map (\e -> div [] (List.append h [errBox e , tl]))     
    |> Maybe.withDefault (div [] (List.append h [tl]))
                  
file2Html : File () -> Html msg
file2Html (File name l) = div [
                           css [
                              border3 (px 1) solid black
                             , paddingLeft (px 30)     
                            ]
                          ]
                          ( (List.map (
                                       
                                       simpleDef2Html    
                                      ) l ))            
