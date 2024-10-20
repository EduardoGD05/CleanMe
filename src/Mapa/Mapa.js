import React, { useEffect, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

const render = (status) => {
  return <h1>{status}</h1>;
};

const MapComponent = () => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: { lat: 32.5293574, lng: -116.9865192 },
        zoom: 16,
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [
              { saturation: -100 }, // Desaturar los colores
              { lightness: 50 }, // Ajustar la luminosidad
            ],
          },
        ],
      });

      // Marcador azul
      const marker = new window.google.maps.Marker({
        position: { lat: 32.5298114984849, lng: -116.98695820193441 },
        map: newMap,
        title: "Marcador Personalizado",
      });

      // Marcador azul LAVANDERÍAS CLEAN MASTER
      const blueMarker = new window.google.maps.Marker({
        position: { lat: 32.51240753466522, lng: -116.98649899925755 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Marcador Azul",
      });

      // Marcador azul LAVANDERÍA JIMY
      const jimyMarker = new window.google.maps.Marker({
        position: { lat: 32.53401887275175, lng: -116.93831379350917 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavandería Jimy",
      });

      // Marcador azul LAVANDERÍA LA BURBUJA
      const bubbleMarker = new window.google.maps.Marker({
        position: { lat: 32.524518266395965, lng: -116.92571244433181 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavandería La Burbuja",
      });

      // Marcador azul LAVANDERÍA KARINA
      const karinaMarker = new window.google.maps.Marker({
        position: { lat: 32.52927715907347, lng: -116.98053252576317 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavandería Karina",
      });

      // Marcador azul LAVAMATICA ANDES
      const andesMarker = new window.google.maps.Marker({
        position: { lat: 32.52601146627489, lng: -116.98662558322566 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica andes",
      });

      // Marcador azul LIZ LAVAMATICA
      const lizMarker = new window.google.maps.Marker({
        position: { lat: 32.52023555462429, lng: -116.98127776501282 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica liz",
      });

      // Marcador azul LAVAMATICA POSTAL
      const postalMarker = new window.google.maps.Marker({
        position: { lat: 32.52500331559912, lng: -116.99615220638874 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica postal",
      });

      // Marcador azul LAVAMATICA SERVI
      const serviMarker = new window.google.maps.Marker({
        position: { lat: 32.52865552378615, lng: -116.97207532085277 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica postal",
      });

      // Marcador azul TONTORERIAS NOVO
      const novoMarker = new window.google.maps.Marker({
        position: { lat: 32.530348546774114, lng: -116.95008019497871 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica novo",
      });

      // Marcador azul TONTORERIAS GASPARÍN
      const gasparinMarker = new window.google.maps.Marker({
        position: { lat: 32.54106801015431, lng: -116.93682020960443 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica gasparin",
      });

      // Marcador azul LAVANDERIA ALEJANDRA
      const alejandraMarker = new window.google.maps.Marker({
        position: { lat: 32.49772000104558, lng: -116.98070552495699 },
        map: newMap,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Ícono azul
        title: "Lavamatica alejandra",
      });

      // Lavandería Jimy
      const jimyInfoWindow = new window.google.maps.InfoWindow({
        content: "Limpiaduría Jimmy <br /><br /> Teléfono: 664 623 8318",
      });

      // Lavandería Jimy
      jimyMarker.addListener("click", () => {
        jimyInfoWindow.open(newMap, jimyMarker);
      });

      // Lavandería La Burbuja
      const bubbleInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería La Burbúja <br /><br /> Teléfono: 664 738 0516",
      });

      // Lavandería La Burbuja
      bubbleMarker.addListener("click", () => {
        bubbleInfoWindow.open(newMap, bubbleMarker);
      });

      // Lavandería Clean Master
      const masterInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Clean Master <br /><br /> Teléfono: 664 622 3723",
      });

      // Lavandería Clean Master
      blueMarker.addListener("click", () => {
        masterInfoWindow.open(newMap, blueMarker);
      });

      // Lavandería Karina
      const karinaInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Karina <br /><br /> Teléfono: 664 932 5377",
      });

      // Lavandería Karina
      karinaMarker.addListener("click", () => {
        karinaInfoWindow.open(newMap, karinaMarker);
      });

      // Lavandería andes
      const andesInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Andes <br /><br /> Teléfono: No disponible",
      });

      // Lavandería andes
      andesMarker.addListener("click", () => {
        andesInfoWindow.open(newMap, andesMarker);
      });

      // Lavandería Liz
      const lizInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Liz <br /><br /> Teléfono: 664 973 6697",
      });

      // Lavandería liz
      lizMarker.addListener("click", () => {
        lizInfoWindow.open(newMap, lizMarker);
      });

      // Lavandería postal
      const postalInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Postal <br /><br /> Teléfono: No disponible",
      });

      // Lavandería postal
      postalMarker.addListener("click", () => {
        postalInfoWindow.open(newMap, postalMarker);
      });

      // Lavandería servi
      const serviInfoWindow = new window.google.maps.InfoWindow({
        content:
          "Lavandería Servi + Clean <br /><br /> Teléfono: No disponible",
      });

      // Lavandería servi
      serviMarker.addListener("click", () => {
        serviInfoWindow.open(newMap, serviMarker);
      });

      // Lavandería novo
      const novoInfoWindow = new window.google.maps.InfoWindow({
        content: "Tintorería Novo <br /><br /> Teléfono: 664 623 1304",
      });

      // Lavandería novo
      novoMarker.addListener("click", () => {
        novoInfoWindow.open(newMap, novoMarker);
      });

      // Lavandería gasparin
      const gasparinInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Gasparín <br /><br /> Teléfono: No disponible",
      });

      // Lavandería gasparin
      gasparinMarker.addListener("click", () => {
        gasparinInfoWindow.open(newMap, gasparinMarker);
      });

      // Lavandería alejandra
      const alejandraInfoWindow = new window.google.maps.InfoWindow({
        content: "Lavandería Alejandra <br /><br /> Teléfono: 664 104 1074",
      });

      // Lavandería alejandra
      alejandraMarker.addListener("click", () => {
        alejandraInfoWindow.open(newMap, alejandraMarker);
      });

      setMap(newMap);
      setInfoWindow(jimyInfoWindow);
    }
  }, [ref, map]);

  return <div ref={ref} style={{ width: "100%", height: "500px" }} />;
};

const YourComponent = () => {
  return <MapComponent />;
};

const Mapa = () => {
  return (
    <Wrapper apiKey={"API_KEY"} render={render}>
      <YourComponent />
    </Wrapper>
  );
};

export default Mapa;
