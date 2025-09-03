export type Category = {
  id: string;
  name: string;
  image: string;
  tags: string[];
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Gaming',
    image: 'https://picsum.photos/id/23/200/300',
    tags: ['IRL', 'RPG'],
  },
  {
    id: '2',
    name: 'Art',
    image: 'https://picsum.photos/id/29/200/300',
    tags: ['Painting'],
  },
  {
    id: '3',
    name: 'Music',
    image: 'https://picsum.photos/id/22/200/300',
    tags: ['Live', 'Music'],
  },
  {
    id: '4',
    name: 'Technology',
    image: 'https://picsum.photos/id/21/200/300',
    tags: ['Coding', 'POV'],
  },
  {
    id: '5',
    name: 'Travel',
    image: 'https://picsum.photos/id/20/200/300',
    tags: ['Adventure'],
  },
  {
    id: '6',
    name: 'Cooking',
    image: 'https://picsum.photos/id/19/200/300',
    tags: ['Recipes'],
  },
];