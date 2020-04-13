module MicroAgda.File exposing (..)

import MicroAgda.Parser exposing (mainParser,parse)
import MicroAgda.Raw as R
import MicroAgda.Internal.Term as I
import MicroAgda.TypeChecker exposing (..)
import MicroAgda.Internal.Ctx exposing (..)
import MicroAgda.Internal.Translate as T

import ParserHelp exposing (..)

import MicroAgda.StringTools exposing (..)

import Result
import List

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict exposing (..)
 

import Parser exposing (run)

type MAError = ParseError String (List Parser.DeadEnd) | InternalError String | TypeError String 

    
type Definition a b c = Definition {
        name : String,
        signature : a,
        args : List b,
        body : a,
        sub : List (Definition a b c),
        data : c    
    }

defMap : (((a1 , a1) , (List b1) , c1) -> ((a2 , a2) , (List b2) , c2)) ->
             Definition a1 b1 c1 -> Definition a2 b2 c2
defMap f (Definition d)=
    let ((si , bo) , (al) , da) = f ((d.signature , d.body) , (d.args) , d.data) in
    Definition {
        name = d.name,
        signature = si,
        args = al,
        body = bo,
        sub = List.map (defMap f) d.sub,
        data = da
            }

defHeadMap : (((a1 , a1) , (List b1) , c1) -> ((a1 , a1) , (List b1) , c1)) ->
             Definition a1 b1 c1 -> Definition a1 b1 c1
defHeadMap f (Definition d)=
    let ((si , bo) , (al) , da) = f ((d.signature , d.body) , (d.args) , d.data) in
    Definition {
        name = d.name,
        signature = si,
        args = al,
        body = bo,
        sub = d.sub,
        data = da
            }
        
defMapSafe : (((a1 , a1) , (List b1) , c1) -> Maybe ((a2 , a2) , (List b2) , c2)) ->
             Definition a1 b1 c1 -> Result (Definition a1 b1 c1) (Definition a2 b2 c2)
defMapSafe f (Definition d) =
    case f ((d.signature , d.body) , (d.args) , d.data) of
         Just ((si , bo) , (al) , da) ->
             mapListResult (defMapSafe f) d.sub
             |> Result.map (\lii ->   
              Definition {
                  name = d.name,
                  signature = si,
                  args = al,
                  body = bo,
                  sub = lii,
                  data = da
                      })
             |> Result.mapError (\_ -> (Definition d))
         Nothing -> Err (Definition d)
             
type alias UnParsedDefinition d = Definition String String d


type alias ParseErrorDefinition d = Definition (String , Result (List Parser.DeadEnd) R.Raw) String d
    
type alias ParsedDefinition d = Definition (String , R.Raw) String d    

type alias TCErrorDefinition d = Definition (String , R.Raw , Maybe (Result String I.Term) )
                                 (String) (Maybe Ctx ,  d)    

type alias TCDefinition d = Definition (String , R.Raw , I.Term )
                                 (String) (Ctx , d)    

                                     
type alias MADefinition d = Result (Result (ParseErrorDefinition d) (TCErrorDefinition d))
                                   (TCDefinition (d))

                                       

type alias DefinitionData d = Definition (String
                                         , Result (List Parser.DeadEnd) R.Raw
                                         , Maybe (Result String I.Term) )
                                 (String , Maybe CType) d                                       


parseErrorDefinitionExtractErr : ParseErrorDefinition d -> Maybe (String , List Parser.DeadEnd)
parseErrorDefinitionExtractErr def =
    getSignature def
   |> Tuple.second
   |> convergeResult (\x -> Just ( Tuple.first (getSignature def) , x ))
      (\_ -> getBody def
             |> Tuple.second
             |> (convergeResult (\x -> Just (Tuple.first (getBody def) , x )) (\_ -> Nothing))
      ) 
                                 
tcErrorDefinitionExtractErr : TCErrorDefinition d -> Maybe (String)
tcErrorDefinitionExtractErr def =
   case (getSignature def , getBody def) of
        ((_ , _ , Just (Err e)) , _ )-> Just e
        ((_) , (_ , _ , Just (Err e)))-> Just e
        _ -> Nothing                                 
   
                                 
extractErr : MADefinition d -> Maybe (Result (String , List Parser.DeadEnd) String) 
extractErr =
    convergeResult
    (convergeResult
         (
          parseErrorDefinitionExtractErr >> Maybe.map Err
         )
         (tcErrorDefinitionExtractErr >> Maybe.map Ok))
    (\_ -> Nothing)
             
unParseDef : UnParsedDefinition d -> String
unParseDef def = (getName def) ++ " : " ++ (getSignature def) ++ "\n"
                 ++ (getName def) ++ " " ++ (String.join " " (getArgs def)) ++ " = \n"
                     ++ (indent 2 (getBody def))

unParseTC : TCDefinition d -> UnParsedDefinition d
unParseTC =
    defMap (\(((_ , _ , a ) , (_ , _ , b )) , c , (ctx , d)) ->
                (((T.t2str ctx a) , (T.t2strWS ctx c b)) , c , d))


    -- (getName def) ++ " : " ++ ( (toTm (getSignatureCT def))) ++ "\n"
    --              ++ (getName def) ++ " " ++ (String.join " " (getArgs def)) ++ " = "
    --                  ++ (T.t2str (getContext def) (getBodyTm def))
                     
madToUnParsed : MADefinition d -> UnParsedDefinition d
madToUnParsed =
  convergeResult
    (convergeResult
       (defMap (\(((a , _) , (b , _)) , c , d) -> (((a) , (b)) , c , d)))
       (defMap (\(((a , _ , _) , (b , _ , _)) , c , (_ , d)) -> (((a) , (b)) , c , d)))
    )
    (defMap (\(((a , _ , _ ) , (b , _ , _ )) , c , (_ , d)) -> (((a) , (b)) , c , d)))               

tryParsedError : ParseErrorDefinition d -> Result (ParseErrorDefinition d) (ParsedDefinition d)
tryParsedError (Definition ped) = Err (Definition ped)
      
tryTCError : TCErrorDefinition d -> Result (TCErrorDefinition d) (TCDefinition d)
tryTCError = Err
             
parseDefinition : UnParsedDefinition d -> Result (ParseErrorDefinition d) (ParsedDefinition d)
parseDefinition =
    defMap (\((si , bo) , (al) , da) -> (((si , parse si) , (bo , parse bo)) , (al) , da))
    >> defMapSafe (\(((si , psi) , (bo , bsi)) , (al) , da) ->
                       case ( psi , bsi) of
                           (Ok a , Ok b) -> Just (((si , a) , (bo , b)) , (al) , da)
                           _ -> Nothing                     
                  )
        
getName : Definition a b c -> String
getName (Definition tcd) = tcd.name

getArgs : Definition a b c -> List b
getArgs (Definition tcd) = tcd.args                           

getTail : Definition a b c -> List (Definition a b c)
getTail (Definition tcd) = tcd.sub                           

getData : Definition a b c -> c
getData (Definition tcd) = tcd.data  
                           
getSignature : Definition a d v -> a 
getSignature (Definition tcd) = tcd.signature

-- this term is valid in the ambient context!                          
getSignatureCT : TCDefinition d -> CType
getSignatureCT (Definition tcd) = 
    case tcd.signature of
        ( _ , _ , tm ) -> (CT tm)

getMADTail : MADefinition d -> List (MADefinition d)
getMADTail =
    convergeResult
    (convergeResult
         (getTail >> List.map (Err >> Err))
         (getTail >> List.map (Ok >> Err)))
    (getTail >> List.map Ok)
                 
-- this is NOT ambient context! it has declared argumetns from telescope, but NOT
-- internal (where) definitions
-- this is ambient scope for internal definitions
getContext : TCDefinition d -> Ctx
getContext = getData >> Tuple.first

getAmbientContext : TCDefinition d -> Ctx
getAmbientContext def = getContext def |> List.drop (List.length (getArgs def))                       
             
getBody : Definition a b c -> a
getBody (Definition tcd) = tcd.body

-- this term is valid in the ambient context!                          
getBodyTm : TCDefinition d -> I.Term
getBodyTm def = Tuple.second (unTelescope (getContext def , getBodyTmInside def) (getArgs def))

-- this term is valid in the internal context!                                                   
getBodyTmInside : TCDefinition d -> I.Term
getBodyTmInside (Definition tcd) =
    case tcd.body of
        ( _ , _ , tm ) -> tm
                          
                          
                          
defineByDef : TCDefinition d -> Ctx -> Ctx 
defineByDef tcd c = define c (getName tcd) (getSignatureCT tcd) (getBodyTm tcd) 

tcDefsList: Ctx -> List (UnParsedDefinition d) -> (List (MADefinition d) , Maybe Ctx)
tcDefsList c =
    let failMap : ParsedDefinition d -> TCErrorDefinition d
        failMap = defMap (\(((a1 , a2) , (a3 , a4)) , a5 , a6)
                         -> (((a1 , a2 , Nothing) , (a3 , a4 , Nothing))
                            , (List.map (\x -> (x)) a5) , (Nothing , a6))) in
    let failMap1 : ParsedDefinition d -> ParseErrorDefinition d
        failMap1 = defMap (\(((a1 , a2) , (a3 , a4)) , a5 , a6)
                         -> (((a1 , Ok a2) , (a3 , Ok a4))
                            , (List.map (\x -> (x)) a5) , a6)) in
    let failMap2 : TCDefinition d -> TCErrorDefinition d
        failMap2 = defMap (\(((a1 , a2 , aa2) , (a3 , a4 , aa4)) , a5 ,(a6a ,  a6))
                         -> (((a1 , a2 , Just (Ok aa2)) , (a3 , a4 , Just (Ok aa4)))
                            , (List.map (\x -> (x)) a5) , (Just a6a , a6 ))) in
    (List.map parseDefinition)
    >> tryResultArr
    >> Result.mapError (List.map (convergeResult identity failMap1) >> (List.map (Err >> Err)) )      
    >> Result.andThen (
                   mapFoldSafe tcDefinition failMap failMap2 defineByDef emptyCtx
                   >> Result.map (\(a , b) -> (List.map Ok b , a))
                   >> Result.mapError (List.map (Ok >> Err))    
                        
                   )
    >> extractOptionalResult 
                                  
tcDefinition : Ctx -> ParsedDefinition d -> Result (TCErrorDefinition d) (TCDefinition d) 
tcDefinition c (Definition pd) =
    let failMap : ParsedDefinition d -> TCErrorDefinition d
        failMap = defMap (\(((a1 , a2) , (a3 , a4)) , a5 , a6)
                         -> (((a1 , a2 , Nothing) , (a3 , a4 , Nothing))
                            , (List.map (\x -> (x)) a5) , (Nothing , a6))) in
    let failMap2 : TCDefinition d -> TCErrorDefinition d
        failMap2 = defMap (\(((a1 , a2 , aa2) , (a3 , a4 , aa4)) , a5 ,(a6a ,  a6))
                         -> (((a1 , a2 , Just (Ok aa2)) , (a3 , a4 , Just (Ok aa4)))
                            , (List.map (\x -> (x)) a5) , (Just a6a , a6 ))) in
    let sigTypeFail = (\s ->
              ((failMap (Definition pd))
              |> defHeadMap
                   (\(((a1 , a2 , bb) , (a3 , a4 ,  cc)) , a5 , a6) ->
                      (((a1 , a2 , Just (Err ("while checking " ++ pd.name ++ " signature: " ++ s))) , (a3 , a4 , cc)) , a5 , a6))
              )) in
    let bodyTypeFail = \sTm -> (\s ->
              ((failMap (Definition pd))
              |> defHeadMap
                   (\(((a1 , a2 , bb) , (a3 , a4 ,  cc)) , a5 , a6) ->
                      (((a1 , a2 , Just (Ok (toTm sTm))) , (a3 , a4 , Just (Err
                                                                        ("while checking " ++ pd.name ++ " body not mach sig: " ++ s)
                                                                           ))) , a5 , a6))
              ))         
    in tYtC c (Tuple.second pd.signature)
       |> Result.mapError sigTypeFail
       |> Result.andThen (\sigTC ->
            telescope ("not a Pi in tele" ) c sigTC pd.args
            |> Result.mapError sigTypeFail                  
            |> Result.andThen (\(ctx , sTy) ->
                                   
                  (mapFoldSafe tcDefinition failMap failMap2 defineByDef ctx pd.sub)
                  |> Result.mapError (\bads ->
                                       Definition {
                                        name = pd.name,
                                        signature =
                                            ((Tuple.first pd.signature) , (Tuple.second pd.signature) , (Just (Ok (toTm sigTC)))) ,
                                        args = pd.args,
                                        body =
                                            ((Tuple.first pd.body) , (Tuple.second pd.body) , Nothing ),
                                        sub = bads ,
                                        data = (Nothing , pd.data)
                                         }
                                     )
                  |> Result.andThen (\(cc , goods) ->
                                     tC cc sTy (Tuple.second pd.body)
                                   |> Result.mapError (bodyTypeFail sTy)
                                   |> Result.map (\boTm ->

                                                      Definition {
                                        name = pd.name,
                                        signature =
                                            ((Tuple.first pd.signature) , (Tuple.second pd.signature) , (toTm sigTC)) ,
                                        args = pd.args,
                                        body =
                                            ((Tuple.first pd.body) , (Tuple.second pd.body) , boTm),
                                        sub = goods ,
                                        data = (ctx , pd.data)
                                         }) 


                                )                
                              )
       )
        
 
        
upc : String -> String -> List String -> String
    -> List (UnParsedDefinition ()) -> (UnParsedDefinition ())   
upc a b c d e = Definition {
        name = a,
        signature = b,
        args = c,
        body = d,    
        sub = e,
        data = ()    
    }

type UnParsedFile = UnParsedFile String (List (UnParsedDefinition ()))
type File d = File String (List (MADefinition d))    

mkFile = UnParsedFile


readSingleDef : Ctx -> UnParsedDefinition d -> ( MADefinition d)         
readSingleDef c =
    parseDefinition
    >> Result.mapError (Err)    
    >> Result.andThen (tcDefinition c >> (Result.mapError Ok) )
    
        
readFile : UnParsedFile -> (File () , Maybe Ctx)
readFile (UnParsedFile name upf) =
    let (mds , mbC) = tcDefsList emptyCtx upf in
    ((File name mds) , mbC)

maybeDef : MADefinition d -> Maybe (CType , I.Term)
maybeDef = (Result.toMaybe >>
        Maybe.map (\def -> (getSignatureCT def , getBodyTm def))
        -- >> Maybe.map (\(x , y) -> (y , x))        
           )
           
lastDefinition : File d -> Maybe (CType , I.Term)
lastDefinition (File _ l) =
    List.head (List.reverse l)
    |> Maybe.andThen
       (Result.toMaybe >>
        Maybe.map (\def -> (getSignatureCT def , getBodyTm def))
                      )    

defsNames : File d -> List String
defsNames (File _ l) =
    l
    |> List.filterMap
       (Result.toMaybe >>
            Maybe.map
            getName )
            
definedDict : File d -> Dict String (CType , I.Term)
definedDict (File _ l) =
    l
    |> List.filterMap
       (Result.toMaybe >>
            Maybe.map
            (pairFrom
                 getName
                 (
                   pairFrom
                      getSignatureCT
                      getBodyTm
                 )
            ))
       |> Dict.fromList    

           
defByName : String -> File d -> Maybe (CType , I.Term)
defByName = Dict.get >> (comp definedDict)
    
       
getUnParsedFileName : UnParsedFile -> String
getUnParsedFileName (UnParsedFile n _) = n        
        
getFileName : File d -> String
getFileName (File n _) = n        
