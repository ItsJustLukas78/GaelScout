'use client'
import CorneredButton from '@/components/CorneredButton'
import EventResult from "@/components/EventResult";
import EventResultSkeleton from "@/components/EventResultSkeleton";
import * as Form from '@radix-ui/react-form';
import React, {useEffect, useState} from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { toast } from "react-toastify";
import { Event, Country, Region } from "@/app/types";
import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import {useGlobalStore} from "@/state/globalState";
import LoadMore from "@/components/LoadMore";
import Spinner from "@/components/Spinner";

const countries: any = {
"Commonly Selected": [{"value":244,"data-code":"US","name":"United States"},{"value":49,"data-code":"CN","name":"China"},{"value":39,"data-code":"CA","name":"Canada"},{"value":14,"data-code":"AU","name":"Australia"},{"value":82,"data-code":"GB","name":"United Kingdom"},{"value":107,"data-code":"IE","name":"Ireland"},{"value":180,"data-code":"NZ","name":"New Zealand"},{"value":239,"data-code":"TW","name":"Taiwan"},{"value":100,"data-code":"HK","name":"Hong Kong"},{"value":164,"data-code":"MX","name":"Mexico"}],
"A": [{"value": 3, "data-code": "AF", "name": "Afghanistan"}, {"value": 16, "data-code": "AX", "name": "Aland Islands" }, {"value": 6, "data-code": "AL", "name": "Albania"}, {"value": 65, "data-code": "DZ", "name": "Algeria" }, {"value": 12, "data-code": "AS", "name": "American Samoa"}, {"value": 1, "data-code": "AD", "name": "Andorra" }, {"value": 9, "data-code": "AO", "name": "Angola"}, {"value": 5, "data-code": "AI", "name": "Anguilla" }, {"value": 10, "data-code": "AQ", "name": "Antarctica"}, {"value": 4, "data-code": "AG", "name": "Antigua and Barbuda" }, {"value": 11, "data-code": "AR", "name": "Argentina"}, {"value": 7, "data-code": "AM", "name": "Armenia" }, {"value": 15, "data-code": "AW", "name": "Aruba"}, {"value": 14, "data-code": "AU", "name": "Australia" }, {"value": 13, "data-code": "AT", "name": "Austria"}, {"value": 17, "data-code": "AZ", "name": "Azerbaijan"}],
"B": [{"value": 33, "data-code": "BS", "name": "Bahamas"}, {"value": 24, "data-code": "BH", "name": "Bahrain" }, {"value": 20, "data-code": "BD", "name": "Bangladesh"}, {"value": 19, "data-code": "BB", "name": "Barbados" }, {"value": 37, "data-code": "BY", "name": "Belarus"}, {"value": 21, "data-code": "BE", "name": "Belgium" }, {"value": 38, "data-code": "BZ", "name": "Belize"}, {"value": 26, "data-code": "BJ", "name": "Benin" }, {"value": 28, "data-code": "BM", "name": "Bermuda"}, {"value": 34, "data-code": "BT", "name": "Bhutan" }, {"value": 30, "data-code": "BO", "name": "Bolivia"}, {"value": 18, "data-code": "BA", "name": "Bosnia and Herzegovina" }, {"value": 36, "data-code": "BW", "name": "Botswana"}, {"value": 35, "data-code": "BV", "name": "Bouvet Island" }, {"value": 32, "data-code": "BR", "name": "Brazil"}, {"value": 31, "data-code": "BQ", "name": "British Antarctic Territory" }, {"value": 111, "data-code": "IO", "name": "British Indian Ocean Territory"}, {"value": 251, "data-code": "VG", "name": "British Virgin Islands" }, {"value": 29, "data-code": "BN", "name": "Brunei"}, {"value": 23, "data-code": "BG", "name": "Bulgaria" }, {"value": 22, "data-code": "BF", "name": "Burkina Faso"}, {"value": 25, "data-code": "BI", "name": "Burundi" }],
"C": [{"value": 123, "data-code": "KH", "name": "Cambodia"}, {"value": 48, "data-code": "CM", "name": "Cameroon" }, {"value": 39, "data-code": "CA", "name": "Canada"}, {"value": 53, "data-code": "CT", "name": "Canton and Enderbury Islands" }, {"value": 55, "data-code": "CV", "name": "Cape Verde"}, {"value": 130, "data-code": "KY", "name": "Cayman Islands" }, {"value": 42, "data-code": "CF", "name": "Central African Republic"}, {"value": 226, "data-code": "TD", "name": "Chad" }, {"value": 47, "data-code": "CL", "name": "Chile"}, {"value": 49, "data-code": "CN", "name": "China" }, {"value": 56, "data-code": "CX", "name": "Christmas Island"}, {"value": 40, "data-code": "CC", "name": "Cocos Islands" }, {"value": 50, "data-code": "CO", "name": "Colombia"}, {"value": 125, "data-code": "KM", "name": "Comoros" }, {"value": 43, "data-code": "CG", "name": "Congo - Brazzaville"}, {"value": 41, "data-code": "CD", "name": "Congo - Kinshasa" }, {"value": 46, "data-code": "CK", "name": "Cook Islands"}, {"value": 51, "data-code": "CR", "name": "Costa Rica" }, {"value": 103, "data-code": "HR", "name": "Croatia"}, {"value": 54, "data-code": "CU", "name": "Cuba" }, {"value": 57, "data-code": "CY", "name": "Cyprus"}, {"value": 58, "data-code": "CZ", "name": "Czech Republic" }],
"D": [{"value": 62, "data-code": "DK", "name": "Denmark"}, {"value": 61, "data-code": "DJ", "name": "Djibouti" }, {"value": 63, "data-code": "DM", "name": "Dominica"}, {"value": 64, "data-code": "DO", "name": "Dominican Republic" }, {"value": 176, "data-code": "NQ", "name": "Dronning Maud Land"}],
"E": [{"value": 232, "data-code": "TL", "name": "East Timor"}, {"value": 66, "data-code": "EC", "name": "Ecuador" }, {"value": 68, "data-code": "EG", "name": "Egypt"}, {"value": 222, "data-code": "SV", "name": "El Salvador" }, {"value": 93, "data-code": "GQ", "name": "Equatorial Guinea"}, {"value": 70, "data-code": "ER", "name": "Eritrea" }, {"value": 67, "data-code": "EE", "name": "Estonia"}, {"value": 72, "data-code": "ET", "name": "Ethiopia"}],
"F": [{"value": 75, "data-code": "FK", "name": "Falkland Islands"}, {"value": 77, "data-code": "FO", "name": "Faroe Islands" }, {"value": 74, "data-code": "FJ", "name": "Fiji"}, {"value": 73, "data-code": "FI", "name": "Finland" }, {"value": 79, "data-code": "FR", "name": "France"}, {"value": 85, "data-code": "GF", "name": "French Guiana" }, {"value": 185, "data-code": "PF", "name": "French Polynesia"}, {"value": 78, "data-code": "FQ", "name": "French Southern and Antarctic Territories" }, {"value": 227, "data-code": "TF", "name": "French Southern Territories"}],
"G": [{"value": 81, "data-code": "GA", "name": "Gabon"}, {"value": 90, "data-code": "GM", "name": "Gambia" }, {"value": 84, "data-code": "GE", "name": "Georgia"}, {"value": 60, "data-code": "DE", "name": "Germany" }, {"value": 87, "data-code": "GH", "name": "Ghana"}, {"value": 88, "data-code": "GI", "name": "Gibraltar" }, {"value": 94, "data-code": "GR", "name": "Greece"}, {"value": 89, "data-code": "GL", "name": "Greenland" }, {"value": 83, "data-code": "GD", "name": "Grenada"}, {"value": 92, "data-code": "GP", "name": "Guadeloupe" }, {"value": 97, "data-code": "GU", "name": "Guam"}, {"value": 96, "data-code": "GT", "name": "Guatemala" }, {"value": 86, "data-code": "GG", "name": "Guernsey"}, {"value": 91, "data-code": "GN", "name": "Guinea" }, {"value": 98, "data-code": "GW", "name": "Guinea-Bissau"}, {"value": 99, "data-code": "GY", "name": "Guyana" }],
"H": [{"value": 104, "data-code": "HT", "name": "Haiti"}, {"value": 101, "data-code": "HM", "name": "Heard Island and McDonald Islands" }, {"value": 102, "data-code": "HN", "name": "Honduras"}, {"value": 100, "data-code": "HK", "name": "Hong Kong" }, {"value": 105, "data-code": "HU", "name": "Hungary"}],
"I": [{"value": 114, "data-code": "IS", "name": "Iceland"}, {"value": 110, "data-code": "IN", "name": "India" }, {"value": 106, "data-code": "ID", "name": "Indonesia"}, {"value": 113, "data-code": "IR", "name": "Iran" }, {"value": 112, "data-code": "IQ", "name": "Iraq"}, {"value": 107, "data-code": "IE", "name": "Ireland" }, {"value": 109, "data-code": "IM", "name": "Isle of Man"}, {"value": 108, "data-code": "IL", "name": "Israel" }, {"value": 115, "data-code": "IT", "name": "Italy"}, {"value": 45, "data-code": "CI", "name": "Côte d’Ivoire"}],
"J": [{"value": 117, "data-code": "JM", "name": "Jamaica"}, {"value": 119, "data-code": "JP", "name": "Japan" }, {"value": 116, "data-code": "JE", "name": "Jersey"}, {"value": 120, "data-code": "JT", "name": "Johnston Island" }, {"value": 118, "data-code": "JO", "name": "Jordan"}],
"K": [{"value": 131, "data-code": "KZ", "name": "Kazakhstan"}, {"value": 121, "data-code": "KE", "name": "Kenya" }, {"value": 124, "data-code": "KI", "name": "Kiribati"}, {"value": 265, "data-code": "XK", "name": "Kosovo" }, {"value": 129, "data-code": "KW", "name": "Kuwait"}, {"value": 122, "data-code": "KG", "name": "Kyrgyzstan" }],
"L": [{"value": 132, "data-code": "LA", "name": "Laos"}, {"value": 141, "data-code": "LV", "name": "Latvia" }, {"value": 133, "data-code": "LB", "name": "Lebanon"}, {"value": 138, "data-code": "LS", "name": "Lesotho" }, {"value": 137, "data-code": "LR", "name": "Liberia"}, {"value": 142, "data-code": "LY", "name": "Libya" }, {"value": 135, "data-code": "LI", "name": "Liechtenstein"}, {"value": 139, "data-code": "LT", "name": "Lithuania" }, {"value": 140, "data-code": "LU", "name": "Luxembourg"}],
"M": [{"value": 155, "data-code": "MO", "name": "Macau"}, {"value": 151, "data-code": "MK", "name": "Macedonia" }, {"value": 148, "data-code": "MG", "name": "Madagascar"}, {"value": 163, "data-code": "MW", "name": "Malawi" }, {"value": 165, "data-code": "MY", "name": "Malaysia"}, {"value": 162, "data-code": "MV", "name": "Maldives" }, {"value": 152, "data-code": "ML", "name": "Mali"}, {"value": 160, "data-code": "MT", "name": "Malta" }, {"value": 149, "data-code": "MH", "name": "Marshall Islands"}, {"value": 157, "data-code": "MQ", "name": "Martinique" }, {"value": 158, "data-code": "MR", "name": "Mauritania"}, {"value": 161, "data-code": "MU", "name": "Mauritius" }, {"value": 260, "data-code": "YT", "name": "Mayotte"}, {"value": 80, "data-code": "FX", "name": "Metropolitan France" }, {"value": 164, "data-code": "MX", "name": "Mexico"}, {"value": 76, "data-code": "FM", "name": "Micronesia" }, {"value": 150, "data-code": "MI", "name": "Midway Islands"}, {"value": 145, "data-code": "MD", "name": "Moldova" }, {"value": 144, "data-code": "MC", "name": "Monaco"}, {"value": 154, "data-code": "MN", "name": "Mongolia" }, {"value": 146, "data-code": "ME", "name": "Montenegro"}, {"value": 159, "data-code": "MS", "name": "Montserrat" }, {"value": 143, "data-code": "MA", "name": "Morocco"}, {"value": 166, "data-code": "MZ", "name": "Mozambique" }, {"value": 153, "data-code": "MM", "name": "Myanmar"}],
"N": [{"value": 167, "data-code": "NA", "name": "Namibia"}, {"value": 177, "data-code": "NR", "name": "Nauru" }, {"value": 175, "data-code": "NP", "name": "Nepal"}, {"value": 173, "data-code": "NL", "name": "Netherlands" }, {"value": 178, "data-code": "NT", "name": "Neutral Zone"}, {"value": 168, "data-code": "NC", "name": "New Caledonia" }, {"value": 180, "data-code": "NZ", "name": "New Zealand"}, {"value": 172, "data-code": "NI", "name": "Nicaragua" }, {"value": 169, "data-code": "NE", "name": "Niger"}, {"value": 171, "data-code": "NG", "name": "Nigeria" }, {"value": 179, "data-code": "NU", "name": "Niue"}, {"value": 170, "data-code": "NF", "name": "Norfolk Island" }, {"value": 127, "data-code": "KP", "name": "North Korea"}, {"value": 156, "data-code": "MP", "name": "Northern Mariana Islands" }, {"value": 174, "data-code": "NO", "name": "Norway"}],
"O": [{"value": 181, "data-code": "OM", "name": "Oman"}],
"P": [{"value": 183, "data-code": "PC", "name": "Pacific Islands Trust Territory"}, {"value": 188, "data-code": "PK", "name": "Pakistan" }, {"value": 196, "data-code": "PW", "name": "Palau"}, {"value": 193, "data-code": "PS", "name": "Palestinian Territory" }, {"value": 182, "data-code": "PA", "name": "Panama"}, {"value": 198, "data-code": "PZ", "name": "Panama Canal Zone" }, {"value": 186, "data-code": "PG", "name": "Papua New Guinea"}, {"value": 197, "data-code": "PY", "name": "Paraguay" }, {"value": 184, "data-code": "PE", "name": "Peru"}, {"value": 187, "data-code": "PH", "name": "Philippines" }, {"value": 191, "data-code": "PN", "name": "Pitcairn"}, {"value": 189, "data-code": "PL", "name": "Poland" }, {"value": 194, "data-code": "PT", "name": "Portugal"}, {"value": 192, "data-code": "PR", "name": "Puerto Rico" }],
"Q": [{"value": 199, "data-code": "QA", "name": "Qatar"}],
"R": [{"value": 200, "data-code": "RE", "name": "Reunion"}, {"value": 201, "data-code": "RO", "name": "Romania" }, {"value": 203, "data-code": "RU", "name": "Russia"}, {"value": 204, "data-code": "RW", "name": "Rwanda"}],
"S": [{"value": 27, "data-code": "BL", "name": "Saint Barth\u00e9lemy"}, {"value": 211, "data-code": "SH", "name": "Saint Helena" }, {"value": 126, "data-code": "KN", "name": "Saint Kitts and Nevis"}, {"value": 134, "data-code": "LC", "name": "Saint Lucia" }, {"value": 147, "data-code": "MF", "name": "Saint Martin"}, {"value": 190, "data-code": "PM", "name": "Saint Pierre and Miquelon" }, {"value": 248, "data-code": "VC", "name": "Saint Vincent and the Grenadines"}, {"value": 257, "data-code": "WS", "name": "Samoa" }, {"value": 216, "data-code": "SM", "name": "San Marino"}, {"value": 220, "data-code": "ST", "name": "Sao Tome and Principe" }, {"value": 205, "data-code": "SA", "name": "Saudi Arabia"}, {"value": 217, "data-code": "SN", "name": "Senegal" }, {"value": 202, "data-code": "RS", "name": "Serbia"}, {"value": 207, "data-code": "SC", "name": "Seychelles" }, {"value": 215, "data-code": "SL", "name": "Sierra Leone"}, {"value": 210, "data-code": "SG", "name": "Singapore" }, {"value": 214, "data-code": "SK", "name": "Slovakia"}, {"value": 212, "data-code": "SI", "name": "Slovenia" }, {"value": 206, "data-code": "SB", "name": "Solomon Islands"}, {"value": 218, "data-code": "SO", "name": "Somalia" }, {"value": 261, "data-code": "ZA", "name": "South Africa"}, {"value": 95, "data-code": "GS", "name": "South Georgia and the South Sandwich Islands" }, {"value": 128, "data-code": "KR", "name": "Korea, Republic of"}, {"value": 266, "data-code": "SS", "name": "South Sudan" }, {"value": 71, "data-code": "ES", "name": "Spain"}, {"value": 136, "data-code": "LK", "name": "Sri Lanka" }, {"value": 208, "data-code": "SD", "name": "Sudan"}, {"value": 219, "data-code": "SR", "name": "Suriname" }, {"value": 213, "data-code": "SJ", "name": "Svalbard and Jan Mayen"}, {"value": 224, "data-code": "SZ", "name": "Eswatini" }, {"value": 209, "data-code": "SE", "name": "Sweden"}, {"value": 44, "data-code": "CH", "name": "Switzerland" }, {"value": 223, "data-code": "SY", "name": "Syria"}],
"T": [{"value": 239, "data-code": "TW", "name": "Taiwan"}, {"value": 230, "data-code": "TJ", "name": "Tajikistan" }, {"value": 240, "data-code": "TZ", "name": "Tanzania"}, {"value": 229, "data-code": "TH", "name": "Thailand" }, {"value": 228, "data-code": "TG", "name": "Togo"}, {"value": 231, "data-code": "TK", "name": "Tokelau" }, {"value": 235, "data-code": "TO", "name": "Tonga"}, {"value": 237, "data-code": "TT", "name": "Trinidad and Tobago" }, {"value": 234, "data-code": "TN", "name": "Tunisia"}, {"value": 236, "data-code": "TR", "name": "Türkiye" }, {"value": 233, "data-code": "TM", "name": "Turkmenistan"}, {"value": 225, "data-code": "TC", "name": "Turks and Caicos Islands" }, {"value": 238, "data-code": "TV", "name": "Tuvalu"}],
"U": [{"value": 195, "data-code": "PU", "name": "U.S. Miscellaneous Pacific Islands"}, {"value": 252, "data-code": "VI", "name": "U.S. Virgin Islands" }, {"value": 242, "data-code": "UG", "name": "Uganda"}, {"value": 241, "data-code": "UA", "name": "Ukraine" }, {"value": 2, "data-code": "AE", "name": "United Arab Emirates"}, {"value": 82, "data-code": "GB", "name": "United Kingdom" }, {"value": 244, "data-code": "US", "name": "United States"}, {"value": 243, "data-code": "UM", "name": "United States Minor Outlying Islands" }, {"value": 245, "data-code": "UY", "name": "Uruguay"}, {"value": 246, "data-code": "UZ", "name": "Uzbekistan" }],
"V": [{"value": 254, "data-code": "VU", "name": "Vanuatu"}, {"value": 247, "data-code": "VA", "name": "Vatican" }, {"value": 250, "data-code": "VE", "name": "Venezuela"}, {"value": 253, "data-code": "VN", "name": "Vietnam" }],
"W": [{"value": 256, "data-code": "WK", "name": "Wake Island"}, {"value": 255, "data-code": "WF", "name": "Wallis and Futuna" }, {"value": 69, "data-code": "EH", "name": "Western Sahara"}],
"Y": [{"value": 259, "data-code": "YE", "name": "Yemen"}],
"Z": [{"value": 262, "data-code": "ZM", "name": "Zambia"}, {"value": 263, "data-code": "ZW", "name": "Zimbabwe" }]
};

const regions: any = {
"71":[{"value":130,"name":"A Coru\u00f1a"},{"value":131,"name":"Alava"},{"value":132,"name":"Albacete"},{"value":133,"name":"Alicante"},{"value":134,"name":"Almeria"},{"value":135,"name":"Asturias"},{"value":136,"name":"Avila"},{"value":137,"name":"Badajoz"},{"value":138,"name":"Baleares"},{"value":139,"name":"Barcelona"},{"value":140,"name":"Burgos"},{"value":141,"name":"Caceres"},{"value":142,"name":"Cadiz"},{"value":143,"name":"Cantabria"},{"value":144,"name":"Castellon"},{"value":145,"name":"Ceuta"},{"value":146,"name":"Ciudad Real"},{"value":147,"name":"Cordoba"},{"value":148,"name":"Cuenca"},{"value":149,"name":"Girona"},{"value":150,"name":"Granada"},{"value":151,"name":"Guadalajara"},{"value":152,"name":"Guipuzcoa"},{"value":153,"name":"Huelva"},{"value":154,"name":"Huesca"},{"value":155,"name":"Jaen"},{"value":156,"name":"La Rioja"},{"value":157,"name":"Las Palmas"},{"value":158,"name":"Leon"},{"value":159,"name":"Lleida"},{"value":160,"name":"Lugo"},{"value":161,"name":"Madrid"},{"value":162,"name":"Malaga"},{"value":163,"name":"Melilla"},{"value":164,"name":"Murcia"},{"value":165,"name":"Navarra"},{"value":166,"name":"Ourense"},{"value":167,"name":"Palencia"},{"value":168,"name":"Pontevedra"},{"value":169,"name":"Salamanca"},{"value":170,"name":"Santa Cruz de Tenerife"},{"value":171,"name":"Segovia"},{"value":172,"name":"Sevilla"},{"value":173,"name":"Soria"},{"value":174,"name":"Tarragona"},{"value":175,"name":"Teruel"},{"value":176,"name":"Toledo"},{"value":177,"name":"Valencia"},{"value":178,"name":"Valladolid"},{"value":179,"name":"Vizcaya"},{"value":180,"name":"Zamora"},{"value":181,"name":"Zaragoza"}],
"44":[{"value":104,"name":"Aargau"},{"value":106,"name":"Appenzell Ausserrhoden"},{"value":105,"name":"Appenzell Innerrhoden"},{"value":108,"name":"Basel-Landschaft"},{"value":109,"name":"Basel-Stadt"},{"value":107,"name":"Bern"},{"value":110,"name":"Freiburg"},{"value":111,"name":"Genf"},{"value":112,"name":"Glarus"},{"value":113,"name":"Graub\u00fcnden"},{"value":114,"name":"Jura"},{"value":115,"name":"Luzern"},{"value":116,"name":"Neuenburg"},{"value":117,"name":"Nidwalden"},{"value":118,"name":"Obwalden"},{"value":120,"name":"Schaffhausen"},{"value":122,"name":"Schwyz"},{"value":121,"name":"Solothurn"},{"value":119,"name":"St. Gallen"},{"value":124,"name":"Tessin"},{"value":123,"name":"Thurgau"},{"value":125,"name":"Uri"},{"value":126,"name":"Waadt"},{"value":127,"name":"Wallis"},{"value":128,"name":"Zug"},{"value":129,"name":"Z\u00fcrich"}],
"164":[{"value":662,"name":"Aguascalientes"},{"value":663,"name":"Baja California"},{"value":664,"name":"Baja California Sur"},{"value":665,"name":"Campeche"},{"value":666,"name":"Chiapas"},{"value":667,"name":"Chihuahua"},{"value":668,"name":"Coahuila"},{"value":669,"name":"Colima"},{"value":671,"name":"Durango"},{"value":672,"name":"Guanajuato"},{"value":673,"name":"Guerrero"},{"value":674,"name":"Hidalgo"},{"value":675,"name":"Jalisco"},{"value":670,"name":"Mexico City"},{"value":676,"name":"Mexico State"},{"value":677,"name":"Michoac\u00e1n"},{"value":678,"name":"Morelos"},{"value":679,"name":"Nayarit"},{"value":680,"name":"Nuevo Le\u00f3n"},{"value":681,"name":"Oaxaca"},{"value":682,"name":"Puebla"},{"value":683,"name":"Quer\u00e9taro"},{"value":684,"name":"Quintana Roo"},{"value":685,"name":"San Luis Potos\u00ed"},{"value":686,"name":"Sinaloa"},{"value":687,"name":"Sonora"},{"value":688,"name":"Tabasco"},{"value":689,"name":"Tamaulipas"},{"value":690,"name":"Tlaxcala"},{"value":691,"name":"Veracruz"},{"value":692,"name":"Yucat\u00e1n"},{"value":693,"name":"Zacatecas"}],
"79":[{"value":186,"name":"Ain"},{"value":191,"name":"Aisne"},{"value":196,"name":"Allier"},{"value":211,"name":"Alpes-Maritimes"},{"value":201,"name":"Alpes-de-Haute-Provence"},{"value":221,"name":"Ardennes"},{"value":216,"name":"Ard\u00e8che"},{"value":226,"name":"Ari\u00e8ge"},{"value":231,"name":"Aube"},{"value":236,"name":"Aude"},{"value":241,"name":"Aveyron"},{"value":521,"name":"Bas-Rhin"},{"value":246,"name":"Bouches-du-Rh\u00f4ne"},{"value":251,"name":"Calvados"},{"value":256,"name":"Cantal"},{"value":261,"name":"Charente"},{"value":266,"name":"Charente-Maritime"},{"value":271,"name":"Cher"},{"value":276,"name":"Corr\u00e8ze"},{"value":281,"name":"Corse-du-Sud"},{"value":301,"name":"Creuse"},{"value":291,"name":"C\u00f4te-d'Or"},{"value":296,"name":"C\u00f4tes-d'Armor"},{"value":581,"name":"Deux-S\u00e8vres"},{"value":306,"name":"Dordogne"},{"value":311,"name":"Doubs"},{"value":316,"name":"Dr\u00f4me"},{"value":641,"name":"Essonne"},{"value":321,"name":"Eure"},{"value":326,"name":"Eure-et-Loir"},{"value":331,"name":"Finist\u00e8re"},{"value":336,"name":"Gard"},{"value":346,"name":"Gers"},{"value":351,"name":"Gironde"},{"value":526,"name":"Haut-Rhin"},{"value":286,"name":"Haute-Corse"},{"value":341,"name":"Haute-Garonne"},{"value":401,"name":"Haute-Loire"},{"value":446,"name":"Haute-Marne"},{"value":556,"name":"Haute-Savoie"},{"value":536,"name":"Haute-Sa\u00f4ne"},{"value":621,"name":"Haute-Vienne"},{"value":206,"name":"Hautes-Alpes"},{"value":511,"name":"Hautes-Pyr\u00e9n\u00e9es"},{"value":646,"name":"Hauts-de-Seine"},{"value":356,"name":"H\u00e9rault"},{"value":361,"name":"Ille-et-Vilaine"},{"value":366,"name":"Indre"},{"value":371,"name":"Indre-et-Loire"},{"value":376,"name":"Is\u00e8re"},{"value":381,"name":"Jura"},{"value":386,"name":"Landes"},{"value":391,"name":"Loir-et-Cher"},{"value":396,"name":"Loire"},{"value":406,"name":"Loire-Atlantique"},{"value":411,"name":"Loiret"},{"value":416,"name":"Lot"},{"value":421,"name":"Lot-et-Garonne"},{"value":426,"name":"Loz\u00e8re"},{"value":431,"name":"Maine-et-Loire"},{"value":436,"name":"Manche"},{"value":441,"name":"Marne"},{"value":451,"name":"Mayenne"},{"value":456,"name":"Meurthe-et-Moselle"},{"value":461,"name":"Meuse"},{"value":466,"name":"Morbihan"},{"value":471,"name":"Moselle"},{"value":476,"name":"Ni\u00e8vre"},{"value":481,"name":"Nord"},{"value":486,"name":"Oise"},{"value":491,"name":"Orne"},{"value":561,"name":"Paris"},{"value":496,"name":"Pas-de-Calais"},{"value":501,"name":"Puy-de-D\u00f4me"},{"value":506,"name":"Pyr\u00e9n\u00e9es-Atlantiques"},{"value":516,"name":"Pyr\u00e9n\u00e9es-Orientales"},{"value":531,"name":"Rh\u00f4ne"},{"value":546,"name":"Sarthe"},{"value":551,"name":"Savoie"},{"value":541,"name":"Sa\u00f4ne-et-Loire"},{"value":566,"name":"Seine-Maritime"},{"value":651,"name":"Seine-Saint-Denis"},{"value":571,"name":"Seine-et-Marne"},{"value":586,"name":"Somme"},{"value":591,"name":"Tarn"},{"value":596,"name":"Tarn-et-Garonne"},{"value":636,"name":"Territoire-de-Belfort"},{"value":661,"name":"Val-d'Oise"},{"value":656,"name":"Val-de-Marne"},{"value":601,"name":"Var"},{"value":606,"name":"Vaucluse"},{"value":611,"name":"Vend\u00e9e"},{"value":616,"name":"Vienne"},{"value":626,"name":"Vosges"},{"value":631,"name":"Yonne"},{"value":576,"name":"Yvelines"}],
"244":[{"value":1,"name":"Alabama"},{"value":2,"name":"Alaska"},{"value":3,"name":"American Samoa"},{"value":4,"name":"Arizona"},{"value":5,"name":"Arkansas"},{"value":6,"name":"Armed Forces Africa"},{"value":7,"name":"Armed Forces Americas"},{"value":8,"name":"Armed Forces Canada"},{"value":9,"name":"Armed Forces Europe"},{"value":10,"name":"Armed Forces Middle East"},{"value":11,"name":"Armed Forces Pacific"},{"value":12,"name":"California"},{"value":13,"name":"Colorado"},{"value":14,"name":"Connecticut"},{"value":15,"name":"Delaware"},{"value":16,"name":"District of Columbia"},{"value":17,"name":"Federated States Of Micronesia"},{"value":18,"name":"Florida"},{"value":19,"name":"Georgia"},{"value":20,"name":"Guam"},{"value":21,"name":"Hawaii"},{"value":22,"name":"Idaho"},{"value":23,"name":"Illinois"},{"value":24,"name":"Indiana"},{"value":25,"name":"Iowa"},{"value":26,"name":"Kansas"},{"value":27,"name":"Kentucky"},{"value":28,"name":"Louisiana"},{"value":29,"name":"Maine"},{"value":30,"name":"Marshall Islands"},{"value":31,"name":"Maryland"},{"value":32,"name":"Massachusetts"},{"value":33,"name":"Michigan"},{"value":34,"name":"Minnesota"},{"value":35,"name":"Mississippi"},{"value":36,"name":"Missouri"},{"value":37,"name":"Montana"},{"value":38,"name":"Nebraska"},{"value":39,"name":"Nevada"},{"value":40,"name":"New Hampshire"},{"value":41,"name":"New Jersey"},{"value":42,"name":"New Mexico"},{"value":43,"name":"New York"},{"value":44,"name":"North Carolina"},{"value":45,"name":"North Dakota"},{"value":46,"name":"Northern Mariana Islands"},{"value":47,"name":"Ohio"},{"value":48,"name":"Oklahoma"},{"value":49,"name":"Oregon"},{"value":50,"name":"Palau"},{"value":51,"name":"Pennsylvania"},{"value":53,"name":"Rhode Island"},{"value":54,"name":"South Carolina"},{"value":55,"name":"South Dakota"},{"value":56,"name":"Tennessee"},{"value":57,"name":"Texas"},{"value":58,"name":"Utah"},{"value":59,"name":"Vermont"},{"value":60,"name":"Virgin Islands"},{"value":61,"name":"Virginia"},{"value":62,"name":"Washington"},{"value":63,"name":"West Virginia"},{"value":64,"name":"Wisconsin"},{"value":65,"name":"Wyoming"}],
"39":[{"value":66,"name":"Alberta"},{"value":67,"name":"British Columbia"},{"value":68,"name":"Manitoba"},{"value":70,"name":"New Brunswick"},{"value":69,"name":"Newfoundland"},{"value":72,"name":"Northwest Territories"},{"value":71,"name":"Nova Scotia"},{"value":73,"name":"Nunavut"},{"value":74,"name":"Ontario"},{"value":75,"name":"Prince Edward Island"},{"value":76,"name":"Quebec"},{"value":77,"name":"Saskatchewan"},{"value":78,"name":"Yukon Territory"}],
"49":[{"value":701,"name":"Anhui"},{"value":702,"name":"Beijing"},{"value":703,"name":"Chongqing"},{"value":704,"name":"Fujian"},{"value":705,"name":"Gansu"},{"value":706,"name":"Guangdong"},{"value":707,"name":"Guangxi"},{"value":708,"name":"Guizhou"},{"value":709,"name":"Hainan"},{"value":710,"name":"Hebei"},{"value":711,"name":"Heilongjiang"},{"value":712,"name":"Henan"},{"value":713,"name":"Hubei"},{"value":714,"name":"Hunan"},{"value":715,"name":"Jiangsu"},{"value":716,"name":"Jiangxi"},{"value":717,"name":"Jilin"},{"value":718,"name":"Liaoning"},{"value":719,"name":"Neimenggu"},{"value":720,"name":"Ningxia"},{"value":721,"name":"Qinghai"},{"value":722,"name":"Shaanxi"},{"value":723,"name":"Shandong"},{"value":724,"name":"Shanghai"},{"value":725,"name":"Shanxi"},{"value":726,"name":"Sichuan"},{"value":727,"name":"Tianjin"},{"value":728,"name":"Xinjiang"},{"value":729,"name":"Xizang"},{"value":730,"name":"Yunnan"},{"value":731,"name":"Zhejiang"}],
"60":[{"value":80,"name":"Baden-W\u00fcrttemberg"},{"value":81,"name":"Bayern"},{"value":82,"name":"Berlin"},{"value":83,"name":"Brandenburg"},{"value":84,"name":"Bremen"},{"value":85,"name":"Hamburg"},{"value":86,"name":"Hessen"},{"value":87,"name":"Mecklenburg-Vorpommern"},{"value":79,"name":"Niedersachsen"},{"value":88,"name":"Nordrhein-Westfalen"},{"value":89,"name":"Rheinland-Pfalz"},{"value":90,"name":"Saarland"},{"value":91,"name":"Sachsen"},{"value":92,"name":"Sachsen-Anhalt"},{"value":93,"name":"Schleswig-Holstein"},{"value":94,"name":"Th\u00fcringen"}],
"13":[{"value":102,"name":"Burgenland"},{"value":99,"name":"K\u00e4rnten"},{"value":96,"name":"Nieder\u00f6sterreich"},{"value":97,"name":"Ober\u00f6sterreich"},{"value":98,"name":"Salzburg"},{"value":100,"name":"Steiermark"},{"value":101,"name":"Tirol"},{"value":103,"name":"Voralberg"},{"value":95,"name":"Wien"}],
"107":[{"value":744,"name":"Limerick"},{"value":732,"name":"Carlow"},{"value":733,"name":"Cavan"},{"value":734,"name":"Clare"},{"value":735,"name":"Cork"},{"value":736,"name":"Donegal"},{"value":737,"name":"Dublin"},{"value":738,"name":"Galway"},{"value":739,"name":"Kerry"},{"value":740,"name":"Kildare"},{"value":741,"name":"Kilkenny"},{"value":742,"name":"Laois"},{"value":743,"name":"Leitrim"},{"value":745,"name":"Longford"},{"value":746,"name":"Louth"},{"value":747,"name":"Mayo"},{"value":748,"name":"Meath"},{"value":749,"name":"Monaghan"},{"value":750,"name":"Offaly"},{"value":751,"name":"Roscommon"},{"value":752,"name":"Sligo"},{"value":753,"name":"Tipperary"},{"value":754,"name":"Waterford"},{"value":755,"name":"Westmeath"},{"value":756,"name":"Wexford"},{"value":757,"name":"Wicklow"}],
};

const allCountries: Country[] = Object.values(countries).flat() as Country[];

enum GradeLevel {
  All = "All",
  HighSchool = "High School",
  MiddleSchool = "Middle School",
}

export default function Events() {
  
  const [eventSearchValue, setEventSearchValue] = useState("");
  const [placeholder, setPlaceholder] = useState("Type an event name...");
  const [placeHolderPhrases] = useState([
    "Type an event name", "Type an event SKU", "Mecha Mayhem", "Mall of America", "RE-VRC-23-1524"
  ]);

  const seasonToEvents = useGlobalStore(state => state.seasonToEvents);
  const setSeasonToEvents = useGlobalStore(state => state.setSeasonToEvents);

  const seasonToEventsAge = useGlobalStore(state => state.seasonToEventsAge);
  const setSeasonToEventsAge = useGlobalStore(state => state.setSeasonToEventsAge);

  const [seasonId, setSeasonId] = useState(181);
  const [seasonEvents, setSeasonEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);

  const [country, setCountry] = useState<string>("All");
  const [region, setRegion] = useState("All");

  const [availableRegions, setAvailableRegions] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  // const eventSKURegex = new RegExp('^RE-VRC-\\d{2}-\\d{4}$');

  useEffect(() => {
    let filtering;

    if (eventSearchValue === "") {
      filtering = upcomingEvents;
    } else {
      filtering = seasonEvents;
    }

    if (country !== "All") {
      const countryName = allCountries.find((c: Country) => {
        return c.value === parseInt(country);
      })?.name;

      filtering = filtering.filter((event: Event) => {
        return event.location.country === countryName;
      });
    }

    if (region !== "N/A" && region !== "All" && region !== "Select Region") {
      filtering = filtering.filter((event: Event) => {
        return event.location.region === region;
      });
    }

    if (eventSearchValue) {
      filtering = filtering.filter((event: Event) => {
        return event.name.toUpperCase().includes(eventSearchValue) || event.sku.toUpperCase().includes(eventSearchValue);
      });
    }

    setFilteredEvents(filtering);
  }, [eventSearchValue, seasonEvents, country, region, upcomingEvents]);

  const increaseEventsShown = () => {
    setDisplayedEvents(filteredEvents.slice(0, (currentPage + 1) * 30));
    setCurrentPage(currentPage + 1);
    setLoading(false);
  }

  useEffect(() => {
    setDisplayedEvents(filteredEvents.slice(0, 30));
    setCurrentPage(1);
    setLoading(false);
  }, [filteredEvents]);

  useEffect(() => {
    let isMounted = true;

    const animatedPlaceholder = async () => {
      while (isMounted) {
        for (let i = 0; i < placeHolderPhrases.length; i++) {
          const phrase = placeHolderPhrases[i] + "...";
          await new Promise(resolve => setTimeout(resolve, 6000));
          setPlaceholder("");
          for (let j = 0; j < phrase.length; j++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setPlaceholder(prevPlaceholder => phrase.substring(0, j + 1));
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    animatedPlaceholder();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setRegion("N/A")
    if (country === "All") {
      setAvailableRegions(["All"]);
    } else if (Object.hasOwn(regions, country)) {
      const regionNames = regions[country].map((region: Region) => {
        return region.name;
      })
      setAvailableRegions(["Select Region", ...regionNames]);
    } else {
      setAvailableRegions(["N/A"]);
    }
  }, [country]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("seasonId", seasonId.toString());

      const response = await fetch(`/api/events?${searchParams.toString()}`);
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        toast.error(data.error);
        return;
      }

      setSeasonToEvents(seasonId, data.events);
      setSeasonEvents(data.events);
      setSeasonToEventsAge(seasonId, new Date());
    } catch (error) {
      console.error(error);
    }
  }

  const hasHydrated = useGlobalStore(state => state._hasHydrated);

  useEffect(() => {
    setLoading(true);

    if (!hasHydrated) {
      return;
    }

    if (seasonToEvents[seasonId] === undefined || seasonToEvents[seasonId].length === 0) {
      getEvents();
    } else if (seasonToEvents[seasonId] !== undefined) {
      const lastDateUpdated = seasonToEventsAge[seasonId];
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - new Date(lastDateUpdated).getTime();

      // six hours
      if (timeDifference > (6 * 1000 * 60 * 60)) {
        getEvents();
      } else {
        setSeasonEvents(seasonToEvents[seasonId]);
      }
    }
  }, [seasonId, hasHydrated]);

  useEffect(() => {
    if (seasonEvents.length > 0) {
      const upcomingEvents = seasonEvents.filter((event: Event) => {
        return (new Date(event.start)).getTime() > (Date.now() - (1000 * 60 * 60 * 24 * 4));
      });
      setUpcomingEvents(upcomingEvents);
    }
  }, [seasonEvents]);


  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center py-32 sm:py-32 overflow-hidden">
        <div className={`flex flex-col justify-center rounded-2xl items-center sm:bg-none sm:p-8 items-left w-full md:w-[800px] lg:w-[900px] xl:w-[1200px]`}>
          <div className={`relative ${eventSearchValue ? "[&>div]:opacity-0" : "sm:w-168 w-96 flex justify-center [&>div]:opacity-100"} [&>div]:[transition:transform_10s,opacity_1s] [&>div]:transition-opacity [&>div]:ease-in-out`}>
            <div className="absolute top-10 left-12 w-28 h-28 sm:w-44 sm:h-44 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute top-10 right-12 w-28 h-28 sm:w-44 sm:h-44 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute -bottom-10 w-28 h-28 sm:w-44 sm:h-44 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob pointer-events-none" />
            <div className="absolute -bottom-10 w-24 h-24 sm:w-48 sm:h-48 bg-white rounded-full mix-blend-difference filter blur-sm opacity-100 animate-spotlight pointer-events-none" />
            <input
              type="textArea"
              key="eventInput"
              defaultValue={eventSearchValue}
              placeholder={placeholder}
              className={`${eventSearchValue ? "text-shadow-sm sm:text-shadow lg:text-shadow-lg shadow-stone-400" : ""} text-center mt-10 mb-5 border-none bg-transparent text-wrap text-2xl font-bold outline-none xs:text-4xl sm:text-5xl placeholder-white placeholder-opacity-100`}
              onChange={(event) => {
                event.preventDefault();
                setEventSearchValue(event.target.value.toUpperCase());
              }}
            >
            </input>
          </div>
        </div>
        <div className="flex flex-wrap w-full sm:w-[700px] [&>div]:w-60 xs:[&>div]:w-80 flex-col items-center justify-center mt-16 gap-3 md:flex-row sm:gap-5 xl:gap-10">
          {/*season selection box*/}
          <div className="flex flex-col">
            <select
              className="h-8 rounded-lg p-0.5 text-black"
              value={seasonId}
              onChange={(e) => setSeasonId(parseInt(e.target.value))}
            >
              <option value="173">Spin Up 2022-23</option>
              <option value="181">Over Under 2023-24</option>
            </select>
            <h3 className="text-sm font-semibold">
              Season
            </h3>
          </div>
          {/*country selection box*/}
          <div className="flex flex-col">
            <select
              className="h-8 rounded-lg p-0.5 text-black"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {["All", ...Object.keys(countries)].map((section: string) => {
                if (section === "All") {
                  return (
                    <option
                      key={section}
                      value={section}
                    >
                      {section}
                    </option>
                  )
                }

                return (
                  <optgroup key={section} label={section}>
                    {countries[section].map((country: Country) => {
                      return (
                        <option
                          key={country.name}
                          value={country.value}
                        >
                          {country.name}
                        </option>
                      )
                    })}
                  </optgroup>
                )
              })}
            </select>
            <h3 className="text-sm font-semibold">
              Country
            </h3>
          </div>
          <div className="flex flex-col">
            <select
              className="h-8 rounded-lg p-0.5 text-black"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={availableRegions.length === 1}
            >
              {availableRegions.map((regionName: string) => {
                return (
                  <option
                    key={regionName}
                    value={regionName}
                  >
                    {regionName}
                  </option>
                )
              })}
            </select>
            <h3 className="text-sm font-semibold">
              Region
            </h3>
          </div>
        </div>
        {/*list events*/}
        <div className="flex flex-col items-center justify-center [&>div]:w-[80%] xs:[&>div]:w-80 sm:[&>div]:w-112 md:[&>div]:w-168">
          <hr className="border-2 border-gray-500 my-10 w-[70%] xs:w-80 sm:w-112 md:w-168" />
          <div className="flex flex-col items-center justify-center mb-3 gap-2 w-full">
            {displayedEvents.map((event: Event) => {
              const locationString = `${event.location.city ? event.location.city + ", " : ""}${event.location.region ? event.location.region + ", " : ""}${event.location.country}`;

              return <>
                <EventResult id={event.id} sku={event.sku} name={event.name} start={event.start} location={locationString} />
              </>
            })}
            {displayedEvents.length === 0 && loading && <Spinner/>}
          </div>
          <LoadMore loadMore={increaseEventsShown} active={currentPage * 30 <= displayedEvents.length} />
        </div>
      </div>
    </main>
  )
}