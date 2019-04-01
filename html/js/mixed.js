new Chart(document.getElementById("mixed"), {
    type: 'bar',
    data: {
      labels: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
      datasets: [{
          label: "Hiilidioksidi",
          type: "line",
          borderColor: "#8e5ea2",
          data: [408,547,675,734,408,547,675,734,408,547,675,734],
          fill: false
        }, {
          label: "Valoisuus",
          type: "line",
          borderColor: "#3e95cd",
          data: [133,221,783,578, 408,547,675,734,408,547,675,473],
          fill: false
        }, {
          label: "PH",
          type: "bar",
          backgroundColor: "rgba(0,30,0,0.2)",
          data: [408,547,675,734,432,562,198,124,754,323,382,432],
        }, {
          label: "Kosteus",
          type: "bar",
          backgroundColor: "rgba(120,0,40,0.2)",
          backgroundColorHover: "#3e95cd",
          data: [133,221,783,978,221,325,111,231,553,534,651,123]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Vuoden tilastot'
      },
      legend: { display: true }
    }
});