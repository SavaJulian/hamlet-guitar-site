import { getHomePermalink, getPermalink } from '~/utils/permalinks';

export const headerData = {
  links: [
    { text: 'Gitaarles', href: `${getHomePermalink()}#gitaarles` },
    { text: 'Hamlet', href: `${getHomePermalink()}#hamlet` },
    { text: 'Veelgestelde vragen', href: `${getHomePermalink()}#vragen` },
  ],
  actions: [{ text: 'Bespreek je eerste les', href: `${getHomePermalink()}#contact` }],
};
export const footerData = {
  links: [],
  secondaryLinks: [{ text: 'Privacy', href: getPermalink('/privacy') }],
  socialLinks: [],
  footNote: 'Hamlet · Gitaarles in Merksem, Antwerpen',
};
