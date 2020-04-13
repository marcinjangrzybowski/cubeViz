module MicroAgda.SampleFiles exposing (sampleFiles)

import MicroAgda.File exposing (..)
import MicroAgda.SampleFiles.Test1 
import MicroAgda.SampleFiles.TestTypeErr
import MicroAgda.SampleFiles.TestParseErr
import MicroAgda.SampleFiles.Prelude
import MicroAgda.SampleFiles.AssocAlt
import MicroAgda.SampleFiles.Assoc
import MicroAgda.SampleFiles.Sample
import MicroAgda.SampleFiles.FaceTest

import MicroAgda.BuildInFile exposing (buildInFileCheck)

import Dict
import List 
    
sampleFiles = Dict.fromList
               (List.map (\x -> ((getUnParsedFileName x) , x))
               [
                (MicroAgda.SampleFiles.Test1.content),
                (MicroAgda.SampleFiles.TestTypeErr.content),
                (MicroAgda.SampleFiles.TestParseErr.content),
                (MicroAgda.SampleFiles.Prelude.content),
                (MicroAgda.SampleFiles.AssocAlt.content),
                (MicroAgda.SampleFiles.Assoc.content),
                (MicroAgda.SampleFiles.Sample.content),
                (MicroAgda.SampleFiles.FaceTest.content),    
                buildInFileCheck    

               ]
               )
