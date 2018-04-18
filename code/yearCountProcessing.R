# Code used to create the "skyscrapers-count.csv", which counts the number of skyscrapers existing in the US for a year.

setwd("C:/Users/ciz4c/Desktop/final")
data <- read.csv("skyscrapers.csv")

temp.df <- as.data.frame(table(data$completed.year))
count <- 0
vect <- c()
for (i in 1:nrow(temp.df)) {
  count <- count + temp.df$Freq[i]
  vect <- c(vect, count)
}

temp.df <- cbind(temp.df, vect)
colnames(temp.df) <- c("year", "num completed", "cumulative")

df <- as.data.frame(1912:2016)
tempvec <- c()
for (i in 1:nrow(df)){
  if (df$year[i]%in%temp.df$year){
    tempvec <- c(tempvec, temp.df$cumulative[which(temp.df$year == df$year[i])])
  }
  else{
    tempvec <- c(tempvec, tempvec[i-1])
  }
}
df <- cbind(df, tempvec)
colnames(df) <- c("year", "cumulative")

write.csv(df, file="skyscrapers-count.csv")
