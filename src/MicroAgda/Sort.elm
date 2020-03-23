module MicroAgda.Sort exposing
    ( .. )


type Comp = Ceq | Clt | Cgt 

compSwitch : Comp -> Comp
compSwitch c = case c of
                   Clt -> Cgt
                   Cgt -> Clt
                   _ -> c       
             
type alias Comparator a = a -> a -> Comp 

thenCompare : Comparator a -> Comparator a -> Comparator a
thenCompare c1 c2 l r =
    case c2 l r of
        Ceq -> c1 l r
        x -> x     
              
compareBy : (a -> b) -> Comparator b -> Comparator a
compareBy f ca x y = ca (f x) (f y)    

compareInts : Comparator Int
compareInts l r = if (l > r) then Cgt else (if (r > l) then Clt else Ceq)

type List2 a = Trunk a | Cons a (List2 a) 
                  
type alias Listlike a b = {
        cons : a -> b -> b
      , trunk : a -> b
      , head : b -> a , tail : b -> Maybe b}

headL2 : List2 a -> a    
headL2 l = case l of
               Trunk a -> a
               Cons a _ -> a           

tailL2 : List2 a -> Maybe (List2 a)    
tailL2 l = case l of
               Trunk _ -> Nothing
               Cons _ t -> Just t 
                           
list2Listlike : a -> Listlike a (List2 a)    
list2Listlike aa = {
     cons = Cons
   , trunk = Trunk
   , head = headL2 , tail = tailL2 }
         
sortListlike : Comparator a -> (Listlike a b) -> b -> b
sortListlike cmp ll l =
    let h = ll.head l in
    case ll.tail l of
        Nothing -> l
        Just tus ->
            let t = sortListlike cmp ll tus in
            let ht = ll.head t in
            case (ll.tail t , cmp h ht) of
                (_ , Ceq) -> t
                (_ , Cgt) -> ll.cons h t 
                (Nothing , Clt) -> ll.cons (ht) (ll.trunk h)   
                (Just tt , Clt) -> ll.cons (ht) (sortListlike cmp ll (ll.cons h tt))


                                   
maybeSort : Comparator a -> Comparator (Maybe a)
maybeSort c l r =
    case (l , r) of
        (Nothing , Nothing) -> Ceq
        (Just _ , Nothing) -> Cgt
        (Nothing , Just _) -> Clt                   
        (Just x , Just y) -> c x y
                             
lexiSort : Comparator a -> Listlike a b -> Comparator b
lexiSort c ll x = 
             (    (compareBy ll.head c)
              |> (thenCompare
                 (compareBy (ll.tail ) (maybeSort (lexiSort c ll)) ))) x 
   
           
concatListlike : (Listlike a b) -> b -> b -> b
concatListlike ll l =
    (ll.cons (ll.head l))
    >> (ll.tail l
       |> Maybe.map (concatListlike ll)
       |> Maybe.withDefault (\x -> x))    


list2filter : Listlike a b -> (a -> Bool) -> b -> (Maybe b) 
list2filter ll f b =
    let tm = ll.tail b |> Maybe.andThen (list2filter ll f) in
    if f (ll.head b)
    then Just (cons2FromMaybe ll (ll.head b) tm)
    else tm    

cons2FromMaybe : Listlike a b -> a -> Maybe b -> b
cons2FromMaybe ll a mb = Maybe.map (ll.cons a) mb |> Maybe.withDefault (ll.trunk a) 


list2toList : Listlike a b -> b -> List a                          
list2toList ll b =
           (ll.tail b)
        |> Maybe.map (\t -> (ll.head b) :: (list2toList ll t))      
        |> Maybe.withDefault ([ll.head b])
    
    
