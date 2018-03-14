use emilmar; # Byt till eget användarnamn

# Om det finns en tidigare databas
drop trigger if exists readCount;
drop table if exists comments cascade;
drop table if exists articles cascade;
drop table if exists sources cascade;
drop table if exists users cascade;


create table sources (
title varchar(255) PRIMARY KEY,
readCount int,
commentCount int,
upvoteCount int,
publicizedCount int
)
CHARACTER SET utf8
COLLATE utf8_general_ci;

create table users (
id int auto_increment PRIMARY KEY,
username varchar(64),
email varchar(255),
commentCount int,
upvoteGivenCount int,
upvoteReceivedCount int,
passw char(128)
)
CHARACTER SET utf8
COLLATE utf8_general_ci;

create table articles (
id varchar(255) Primary KEY,
commentCount int,
upvoteCount int,
readCount int,
title varchar(255),
content text,
sourcee varchar(255) NOT NULL,
pubTime datetime,
FOREIGN KEY (sourcee) REFERENCES sources(title)
)
CHARACTER SET utf8
COLLATE utf8_general_ci;

create table comments (
id int auto_increment PRIMARY key,
pubTime datetime,
upvoteCount int,
content text,
uid int NOT NULL,
username varchar(255),
article varchar(255) NOT NULL,
FOREIGN KEY (uid) references users(id),
FOREIGN KEY (article) references articles(id)
)
CHARACTER SET utf8
COLLATE utf8_general_ci;

insert into users values (null, 'e', 'emilmar@kth.se', 0, 0, 0, '3F79BB7B435B05321651DAEFD374CDC681DC06FAA65E374E38337B88CA046DEA');
insert into users values (null, '1', 'lsaari@kth.se', 0, 0, 0, 'D4735E3A265E16EEE03F59718B9B5D03019C07D8B6C51F90DA3A666EEC13AB35');
insert into sources values ('Cision', 0, 0, 0, 0);
insert into sources values ('DI', 0, 0, 0, 0);
