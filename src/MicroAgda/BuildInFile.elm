module MicroAgda.BuildInFile exposing (buildInFileCheck)

import MicroAgda.File exposing (..)

import Dict
import List

import Debug exposing (..)

import MicroAgda.Internal.Term exposing (..)
import MicroAgda.Internal.Translate exposing (..)
    
buildInFileCheck  : UnParsedFile
buildInFileCheck = UnParsedFile "buildInFileTypes"
                   (List.map (\(nam , ob) ->
                                  (upc (nam ++ "Test") (t2strNoCtx ob.ty)
                                  []
                                  nam
                                  [])

                             ) buildInTokensList)
