CREATE TABLE public.users (
	email varchar(254) NULL,
	uid varchar(40) NULL
);

CREATE TABLE public.settings (
	uid varchar(40) NULL,
	settings json NULL
);

CREATE TABLE public.fooddatabase (
	fid varchar(40) NOT NULL,
	uid varchar(40) NOT NULL,
	foodobject json NOT NULL,
	CONSTRAINT firstkey PRIMARY KEY (fid)
);

CREATE TABLE public.diary (
	uid varchar(40) NOT NULL,
	"date" date NOT NULL,
	"foodEntry" json NULL,
	"isDirectEntry" bool NULL,
	serving varchar(40) NULL,
	did varchar(40) NULL,
	"timestamp" varchar(16) NULL
);

