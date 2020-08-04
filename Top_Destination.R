library(reshape)
library(data.table)
library(plyr)
library(foreign)
library(maptools)
library(rgdal)
library(httr)




args <- commandArgs(trailingOnly = TRUE)
source(args[1])

#read trip data


Top10_Des <- function(submode_DT,file){
  
  submode_DT         <- count(submode_DT , c("otaz", "dtaz"))
  taz_list           <- sort(unique(submode_DT$otaz))
  
  for (taz in taz_list  ){
    submode_DT_taz 	     <- submode_DT[submode_DT$otaz == taz,]
    submode_DT_taz $rank <- rank(-submode_DT_taz $freq,ties.method="min")
    submode_DT_taz      <-  submode_DT_taz [order( submode_DT_taz$rank,decreasing = F),]
    
    if (length(submode_DT_taz$rank)>10){
      submode_DT_taz<-submode_DT_taz[1:10,] 
    }
    cat(sprintf   ("var TAZ%s_Data = [\n",taz ),file=file,append=TRUE)
    
    for (line in 1:length (submode_DT_taz$freq)){
      cat(sprintf   ("[{name: 'TAZ%s'}, {name: 'TAZ%s', value:%s}],\n",taz,submode_DT_taz$dtaz[line],submode_DT_taz$freq[line]),file=file,append=TRUE)
    }
    
    cat(sprintf   ("];\n\n" ),file=file,append=TRUE)       
    
  }
  
}



Trip_Tsv_Process <- function(tripfile){
  
  trip <- read.table(tripfile, header = TRUE,sep = "	") 
  trip <- data.frame(trip)
  DT   <- data.table(trip)
  
  #TAZ_List <- unique(DT$otaz)
  
  
  #by mode
  DT_all 		  <- DT
  DT_walk 		  <- DT[DT$mode == 1,]
  DT_bike 		  <- DT[DT$mode == 2,]
  DT_sov 	      <- DT[DT$mode == 3,]
  DT_hov2 		  <- DT[DT$mode == 4,]
  DT_hov3plus	  <- DT[DT$mode == 5,]
  DT_transit 	  <- DT[DT$mode == 6,]
  DT_schoolbus	  <- DT[DT$mode == 8,]
  
  Top10_Des(DT_walk,output_walk ) 
  Top10_Des(DT_bike,output_bike) 
  Top10_Des(DT_sov,output_sov) 
  Top10_Des(DT_hov2,output_hov2) 
  Top10_Des(DT_hov3plus,output_hov3plus) 
  Top10_Des(DT_transit,output_transit) 
  Top10_Des(DT_schoolbus,output_schoolbus) 
  Top10_Des(DT_all,output_all) 

  
}


Trip_Tsv_Process(tripfile)










