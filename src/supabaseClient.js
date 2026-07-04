import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lupneddggdjwsnmnbaor.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cG5lZGRnZ2Rqd3NubW5iYW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNjAzNTQsImV4cCI6MjA5NzkzNjM1NH0.oNhhCn1D-xSEh07B9TyJk2IMKHXwIBhuDchkQQhVTyo";

export const supabase = createClient(supabaseUrl, supabaseKey);