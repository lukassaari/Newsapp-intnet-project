use emilmar; # Byt till eget användarnamn

# Om det finns en tidigare databas
drop table if exists comments cascade;
drop table if exists articles cascade;
drop table if exists sources cascade;
drop table if exists users cascade;
drop table if exists kommentarer cascade;
drop table if exists nyhetsartiklar cascade;
drop table if exists anvandare cascade;
drop table if exists kallor cascade;


create table sources (
id int auto_increment PRIMARY KEY,
title varchar(255),
readCount int,
commentCount int,
upvoteCount int,
publicizedCount date
)
CHARACTER SET utf8 
COLLATE utf8_general_ci;

create table users (
id int auto_increment PRIMARY KEY,
username varchar(64),
email varchar(255),
commentCount int,
upvoteCount int,
passw char(128)
)
CHARACTER SET utf8 
COLLATE utf8_general_ci;

create table articles (
id int auto_increment Primary KEY,
commentCount int,
upvoteCount int,
readCount int,
title varchar(255),
sourcee int NOT NULL,
FOREIGN KEY (sourcee) REFERENCES sources(id)
)
CHARACTER SET utf8 
COLLATE utf8_general_ci;

create table comments (
id int auto_increment PRIMARY key,
pubTime datetime,
upvoteCount int,
content text,
username int NOT NULL,
article int NOT NULL,
FOREIGN KEY (username) references users(id),
FOREIGN KEY (article) references articles(id)
) 
CHARACTER SET utf8 
COLLATE utf8_general_ci;