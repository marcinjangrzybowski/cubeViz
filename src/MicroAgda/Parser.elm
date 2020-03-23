module MicroAgda.Parser exposing (..)

import Set 
import Parser exposing (Parser, (|.), (|=), succeed, symbol, float, spaces, oneOf , lazy , variable , andThen)

import ParserHelp exposing (..)

import Parser.Advanced as A

import Maybe exposing (Maybe , withDefault)

import MicroAgda.Raw exposing (..)

agdaName : Parser String
agdaName =
  variable
    { start = isAgdaNameChar
    , inner = isAgdaNameChar
    , reserved = Set.fromList [ "let", "in", "case", "of", "=" , "≡" , ":" ]
    }    

varP : Parser Raw
varP = succeed Var |= agdaName

mainParser = succeed identity |. spaces |= piParser |. spaces |. Parser.end

operator : Parser Raw
operator =
  oneOf
    [ succeed (\_ -> Var "Max") |= (symbol "∨")
    , succeed (\_ -> Var "Min") |= (symbol "∧")
    ]

appOp : Raw -> Raw -> Raw -> Raw
appOp a op b = App (App op a) b 

       
faceExprPaser : Parser FaceExpr
faceExprPaser = Parser.sequence 
    { start = ""
    , separator = ""
    , end = ""
    , spaces = spaces
    , item = succeed Tuple.pair
             |. spaces
             |. symbol "("
             |. spaces   
             |= lazy (\_ -> piParser)
             |. spaces
             |. symbol "="
             |. spaces
             |= oneOf [
                  succeed (\_ -> True) |= (symbol "i1")
                , succeed (\_ -> False) |= (symbol "i0")
                ] 
             |. spaces
             |. symbol ")"
             |. spaces   
    , trailing = Parser.Optional
    }
    
               
               
lamPParser : Parser Raw
lamPParser =           
    Parser.sequence 
    { start = "λ {"
    , separator = ";"
    , end = "}"
    , spaces = spaces
    , item = succeed Tuple.pair
             |. spaces
             |= faceExprPaser
             |. spaces
             |. symbol "→"
             |. spaces
             |= lazy (\_ -> piParser)
             |. spaces   
    , trailing = Parser.Forbidden
    } |> andThen (\l -> succeed (LamP l) )             

namesList : Parser (List String)
namesList =
  Parser.sequence
    { start = ""
    , separator = ""
    , end = ""
    , spaces = spaces
    , item = agdaName
    , trailing = Parser.Forbidden -- demand a trailing semi-colon
    }
    
piParser : Parser Raw
piParser =
    
  oneOf  [
    A.backtrackable (succeed (Pi "unnamed")  
      |= expressionParser
      |. spaces
      |. symbol "→"
      |. spaces
      |= lazy (\_ -> piParser))
    ,    
    succeed (\symL -> \dom -> \codom ->
                 List.foldr (\s -> Pi s dom) codom symL  )
      |. symbol "∀"
      |. spaces
      |. symbol "("
      |. spaces
      |= namesList
      -- |. spaces  
      -- |= agdaName  
      |. spaces  
      |. symbol ":"
      |. spaces
      |= lazy (\_ -> piParser)
      |. spaces
      |. symbol ")" |. spaces |. symbol "→"
      |. spaces
      |= lazy (\_ -> piParser)
     ,
     A.backtrackable (succeed Lam
      |. symbol "λ"
      |. spaces
      |= agdaName
      |. spaces
      |. symbol "→"
      |. spaces
      |= lazy (\_ -> piParser))
     ,   
     -- A.backtrackable (succeed (Pi "x")  
     --  |= expressionParser
     --  |. spaces
     --  |. symbol "≡"
     --  |. spaces
     --  |= lazy (\_ -> piParser))
     --  ,
      A.backtrackable lamPParser
     ,
      A.backtrackable (succeed appOp
      |= lazy (\_ -> expressionParser)
      |. spaces
      |= operator
      |. spaces
      |= lazy (\_ -> piParser))
     ,      
     expressionParser   
    ] 
             
rawParser : Parser Raw
rawParser =
  oneOf  [
       succeed identity
          |. symbol "("
          |. spaces
          |= lazy (\_ -> piParser)
          |. spaces
          |. symbol ")"
      ,
           varP     
    ]

            
expressionParser : Parser Raw
expressionParser =
  rawParser
    |> andThen (expressionHelp [])



       
expressionHelp : List Raw -> Raw -> Parser Raw
expressionHelp revOps expr =
  oneOf
    [
     A.backtrackable (succeed identity
        |. spaces
        |= rawParser
        |> andThen (\newExpr -> expressionHelp (expr :: revOps) newExpr))
    -- , A.backtrackable (succeed Tuple.pair
    --     |. spaces
    --     |= operator                
    --     |. spaces                 
    --     |= rawParser
    --     |> andThen (\( op , newExpr ) -> expressionHelp appOp expr op newExpr))
    , lazy (\_ -> succeed (finalize revOps expr))
    ]

finalize : List Raw -> Raw -> Raw
finalize l y =
    case l of
        [] -> y
        x :: xs -> (App (finalize xs x) y )      

parse = Parser.run mainParser                    
