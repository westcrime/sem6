
COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
drop table PROD.TEST7 cascade constraints;                                      
ALTER TABLE "PROD"."TEST2" ADD ("ID" NUMBER);                                   
  ALTER TABLE "PROD"."TEST2" DROP ("IDD");                                      
  ALTER TABLE "PROD"."TEST2" DROP CONSTRAINT "ID2_UNIQUE";                      
  ALTER TABLE "PROD"."TEST2" ADD CONSTRAINT "ID2_UNIQUE" UNIQUE ("ID") USING IND
EX PCTFREE 10 INITRANS 2 ENABLE;                                                
  CREATE TABLE "PROD"."TEST3"                                                   
   (	"ID" NUMBER,                                                               
	 CONSTRAINT "ID3_UNIQUE" UNIQUE ("ID")                                         
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255                                
  TABLESPACE "USERS"  ENABLE                                                    

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
   ) SEGMENT CREATION DEFERRED                                                  
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255                                 
 NOCOMPRESS LOGGING                                                             
  TABLESPACE "USERS" ;                                                          
                                                                                
  CREATE TABLE "PROD"."TEST5"                                                   
   (	"ID" NUMBER,                                                               
	"ID_TEST2" NUMBER,                                                             
	 CONSTRAINT "ID5_UNIQUE" UNIQUE ("ID")                                         
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255                                
  TABLESPACE "USERS"  ENABLE,                                                   

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
	 CONSTRAINT "TEST2_FK" FOREIGN KEY ("ID_TEST2")                                
	  REFERENCES "PROD"."TEST2" ("ID") ON DELETE SET NULL ENABLE                   
   ) SEGMENT CREATION DEFERRED                                                  
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255                                 
 NOCOMPRESS LOGGING                                                             
  TABLESPACE "USERS" ;                                                          
                                                                                
  CREATE TABLE "PROD"."TEST6"                                                   
   (	"ID" NUMBER,                                                               
	"ID_TEST4" NUMBER,                                                             
	"ID_TEST5" NUMBER,                                                             

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
	 CONSTRAINT "ID6_UNIQUE" UNIQUE ("ID")                                         
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255                                
  TABLESPACE "USERS"  ENABLE,                                                   
	 CONSTRAINT "TEST4_FK" FOREIGN KEY ("ID_TEST4")                                
	  REFERENCES "PROD"."TEST4" ("ID") ON DELETE SET NULL ENABLE,                  
	 CONSTRAINT "TEST5_FK" FOREIGN KEY ("ID_TEST5")                                
	  REFERENCES "PROD"."TEST5" ("ID") ON DELETE SET NULL ENABLE                   
   ) SEGMENT CREATION DEFERRED                                                  
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255                                 
 NOCOMPRESS LOGGING                                                             
  TABLESPACE "USERS" ;                                                          

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
drop index PROD.IND3;                                                           
drop index PROD.ID2_UNIQUE;                                                     
drop index PROD.ID7_UNIQUE;                                                     
                                                                                
  CREATE UNIQUE INDEX "PROD"."ID2_UNIQUE" ON "PROD"."TEST2" ("ID")              
  PCTFREE 10 INITRANS 2 MAXTRANS 255                                            
  TABLESPACE "USERS" ;                                                          
                                                                                
  CREATE INDEX "PROD"."IND1" ON "PROD"."TEST5" ("ID_TEST2")                     
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS                         
  TABLESPACE "USERS" ;                                                          

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
                                                                                
  CREATE UNIQUE INDEX "PROD"."ID3_UNIQUE" ON "PROD"."TEST3" ("ID")              
  PCTFREE 10 INITRANS 2 MAXTRANS 255                                            
  TABLESPACE "USERS" ;                                                          
                                                                                
  CREATE UNIQUE INDEX "PROD"."ID5_UNIQUE" ON "PROD"."TEST5" ("ID")              
  PCTFREE 10 INITRANS 2 MAXTRANS 255                                            
  TABLESPACE "USERS" ;                                                          
                                                                                
  CREATE UNIQUE INDEX "PROD"."ID6_UNIQUE" ON "PROD"."TEST6" ("ID")              
  PCTFREE 10 INITRANS 2 MAXTRANS 255                                            

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
  TABLESPACE "USERS" ;                                                          
drop FUNCTION PROD.FUNC2;                                                       
drop FUNCTION PROD.FUNC1;                                                       
                                                                                
  CREATE OR REPLACE EDITIONABLE FUNCTION "PROD"."FUNC2" (id number) return numbe
r                                                                               
as                                                                              
begin                                                                           
    if id < 1 then                                                              
        return id;                                                              
    end if;                                                                     

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
    return id + prod.func2(id - 1);                                             
end;                                                                            
/                                                                               
                                                                                
  CREATE OR REPLACE EDITIONABLE FUNCTION "PROD"."FUNC3" (id number) return numbe
r                                                                               
as                                                                              
begin                                                                           
    if id < 1 then                                                              
        return id;                                                              
    end if;                                                                     

COMPARE_SCHEMA_ALTER('DEV','PROD')                                              
--------------------------------------------------------------------------------
    return id + prod.func2(id - 1);                                             
end;                                                                            
/                                                                               
                                                                                

