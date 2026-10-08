CREATE TABLE sessions (
 id TEXT PRIMARY KEY, token TEXT NOT NULL, visitor TEXT NOT NULL, ip TEXT NOT NULL,
 started INTEGER NOT NULL, last_seen INTEGER NOT NULL, ended INTEGER,
 active_ms INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 0,
 race TEXT NOT NULL DEFAULT '', job TEXT NOT NULL DEFAULT '', floor INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX sessions_last_seen ON sessions(last_seen);
CREATE INDEX sessions_visitor ON sessions(visitor);
