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
colnames(df) <- c("year")
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

# by purpose
hotels <- which(data$hotel == "TRUE")
hotelRows <- data[hotels,]

temp.df <- as.data.frame(table(hotelRows$completed.year))
count <- 0
vect <- c()
for (i in 1:nrow(temp.df)) {
  count <- count + temp.df$Freq[i]
  vect <- c(vect, count)
}

temp.df <- cbind(temp.df, vect)
colnames(temp.df) <- c("year", "num completed", "cumulative")

tempvec <- c()
for (i in 1:nrow(df)){
  if (df$year[i]%in%temp.df$year){
    tempvec <- c(tempvec, temp.df$cumulative[which(temp.df$year == df$year[i])])
  }
  else if (df$year[i] == 1912){
    tempvec <- c(tempvec, 0)
  }
  else  {tempvec <- c(tempvec, tempvec[i-1])
  }
}
df <- cbind(df, tempvec)


# offices
office <- which(data$office == "TRUE")
officeRows <- data[office,]
temp.df <- as.data.frame(table(officeRows$completed.year))
count <- 0
vect <- c()
for (i in 1:nrow(temp.df)) {
  count <- count + temp.df$Freq[i]
  vect <- c(vect, count)
}

temp.df <- cbind(temp.df, vect)
colnames(temp.df) <- c("year", "num completed", "cumulative")
tempvec <- c()
for (i in 1:nrow(df)){
  if (df$year[i]%in%temp.df$year){
    tempvec <- c(tempvec, temp.df$cumulative[which(temp.df$year == df$year[i])])
  }
  else if (df$year[i] == 1912){
    tempvec <- c(tempvec, 0)
  }
  else  {tempvec <- c(tempvec, tempvec[i-1])
  }
}
df <- cbind(df, tempvec)

# residential
residential <- which(data$residential == "TRUE")
resRows <- data[residential,]
temp.df <- as.data.frame(table(resRows$completed.year))
count <- 0
vect <- c()
for (i in 1:nrow(temp.df)) {
  count <- count + temp.df$Freq[i]
  vect <- c(vect, count)
}

temp.df <- cbind(temp.df, vect)
colnames(temp.df) <- c("year", "num completed", "cumulative")
tempvec <- c()
for (i in 1:nrow(df)){
  if (df$year[i]%in%temp.df$year){
    tempvec <- c(tempvec, temp.df$cumulative[which(temp.df$year == df$year[i])])
  }
  else if (df$year[i] == 1912){
    tempvec <- c(tempvec, 0)
  }
  else  {tempvec <- c(tempvec, tempvec[i-1])
  }
}
df <- cbind(df, tempvec)
colnames(df) <- c("year", "cumulative", "hotel", "office", "residential")
write.csv(df, file="skyscrapers-count.csv")

