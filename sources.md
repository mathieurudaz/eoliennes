**Carte des vents**: 
Atlas des vents de la Suisse: vitesse moyenne et distribution des vents à 150 m du sol (Office fédéral de l'énergie)
https://data.geo.admin.ch/ch.bfe.windenergie-geschwindigkeit_h150/
État d'actualité 23.02.2016

**Carte d'élévation**: 

http://www.opendem.info/opendemeu_background.html

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

**Liste des couches**

1.  SWISSTOPO
1a. Geometrie Canton
1b. Geometrie Communes
1c. Geometrie Districts
1d. Points des villes
    - (Nom)
1e. (Points labels des villes)
    - Nom

2.  PARCS
2a. Geometrie des parcs
2b. Points centroids des parcs
    - Nom
    - Nombre d'eoliennes
2c. Points labels des parcs
    - Nom
    - Nombre d'eoliennes
2d. Geometrie buffer polyones  5.0km
2e. Geometrie buffer polyones  7.5km
2f. Geometrie buffer polyones 10.0km

3.  WINDATLAS
3a. Geometrie couches 1 a 7(?)

4.  VIEWSHED
4a. Geometrie couches 1 a 3
4b. Geometrie Forets

5.  ZONES D'EXCLUSION
5a. Geometrie Parcs
5b. Geometrie IFP

6.  LIMITES D3
6a. Geometrie Limites D3


