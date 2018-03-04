use emilmar; # Byt till eget användarnamn

drop table if exists kallor; # Om det finns en tidigare databas
drop table if exists anvandare;
drop table if exists kommentarer;
drop table if exists nyhetsartiklar;

create table kallor (
id int PRIMARY KEY,
rubrik varchar(255),
antal_last int,
antal_kom int,
antal_gillad int,
publicerad date
)
CHARACTER SET utf8 
COLLATE utf8_general_ci;

create table anvandare (
id int PRIMARY KEY,
namn varchar(64),
email varchar(255),
antal_kom int,
antal_gillad int,
losenord char(128)
)
CHARACTER SET utf8 
COLLATE utf8_general_ci;

create table nyhetsartiklar (
id int PRIMARY KEY,
antal_kom int,
antal_gillad int,
antal_artiklar int,
namn varchar(255),
kalla int NOT NULL,
FOREIGN KEY (kalla) REFERENCES kallor(id)
)
CHARACTER SET utf8 
COLLATE utf8_general_ci;

create table kommentarer (
id int PRIMARY key,
publicerad datetime,
antal_gillad int,
kommentar text,
anvandare int NOT NULL,
artikel int NOT NULL,
FOREIGN KEY (anvandare) references anvandare(id),
FOREIGN KEY (artikel) references nyhetsartiklar(id)
) 
CHARACTER SET utf8 
COLLATE utf8_general_ci;