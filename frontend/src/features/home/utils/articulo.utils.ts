const CARRERA_COLORS: Record<string, string> = {
    default: "#185FA5",
    Ingeniería: "#1D9E75",
    Medicina: "#D85A30",
    Derecho: "#7F77DD",
    Economía: "#BA7517",
    Educación: "#639922",
};

export function getCarreraColor(carrera: string): string {
    for (const key of Object.keys(CARRERA_COLORS)) {
        if (carrera?.toLowerCase().includes(key.toLowerCase())) return CARRERA_COLORS[key];
    }
    return CARRERA_COLORS.default;
}

export function formatFecha(fecha: string): string {
    if (!fecha) return "";
    try {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return fecha;
    }
}