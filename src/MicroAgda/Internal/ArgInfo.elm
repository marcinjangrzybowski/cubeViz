module MicroAgda.Internal.ArgInfo exposing
    ( ArgInfo(..) , Visibility(..) , default)

type Visibility = Hidden | Visible

-- type ArgInfo =
--      ArgInfo {
--            visibility : Visibility
--          , name : Maybe String    
--         }

type ArgInfo = ArgInfo
    { visibility : Visibility }

default = ArgInfo {visibility = Visible}
             
--toString (ArgInfo s) = s
         
