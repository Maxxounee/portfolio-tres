export function getStaticLink(link: string) {
    return `${import.meta.env.BASE_URL}${link}`;
}
