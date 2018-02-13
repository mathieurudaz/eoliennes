**Carte des vents**: https://data.geo.admin.ch/ch.bfe.windenergie-geschwindigkeit_h150/
**Carte d'élévation**: http://www.opendem.info/definitions.html

- Filtre blanc opacite sur carte des vents a part. garder parcs sur carte solide (IMG)
 - Zones d'exclusion en rose/orange, parcs en vert (ou inverse)
 - Parcs avec villes, pas de label sur les parcs
 - Garder les memes cercles de visibilite sur cate #1 et #1


Raster calculator: Condition
https://gis.stackexchange.com/questions/141305/conditional-calculation-qgis-raster-calculator-or-grass-r-mapcalculator

187 = >8.0  ->  9
204 = >7.5  ->  8
181 = >7.0  ->  7
155 = >6.5  ->  6
133 = >6    ->  5
 54 = >5.5  ->  4
 47 = >5.0  ->  3
 78 = >4.5  ->  2
122 = >4.0  ->  1
201 = <4.0  ->  0

(("Windatlas_clipped_single_band-EPSG3857@1"=201) * 1) + 
(("Windatlas_clipped_single_band-EPSG3857@1"=122) * 2) +
(("Windatlas_clipped_single_band-EPSG3857@1"=78) * 3) +
(("Windatlas_clipped_single_band-EPSG3857@1"=47) * 4) +
(("Windatlas_clipped_single_band-EPSG3857@1"=54) * 5) +
(("Windatlas_clipped_single_band-EPSG3857@1"=133) * 6) +
(("Windatlas_clipped_single_band-EPSG3857@1"=155) * 7) +
(("Windatlas_clipped_single_band-EPSG3857@1"=181) * 8) +
(("Windatlas_clipped_single_band-EPSG3857@1"=204) * 9) +
(("Windatlas_clipped_single_band-EPSG3857@1"=187) * 10)