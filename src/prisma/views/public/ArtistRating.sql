SELECT
  a.id,
  a.name,
  a.surname,
  a.nickname,
  count(us."songId") AS rating
FROM
  (
    (
      "Artist" a
      LEFT JOIN "Song" s ON ((s."artistId" = a.id))
    )
    LEFT JOIN "UserSong" us ON ((us."songId" = s.id))
  )
GROUP BY
  a.id,
  a.name,
  a.surname;