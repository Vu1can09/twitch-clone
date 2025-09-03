export type Interest = {
  id: string;
  name: string;
  color: string;
};

export const interests: Interest[] = [
  { id: '1', name: 'Technology', color: '#FF5733' },
  { id: '2', name: 'Music', color: '#33FF57' },
  { id: '3', name: 'Travel', color: '#3357FF' },
  { id: '4', name: 'Food', color: '#FF33A1' },
  { id: '5', name: 'Fitness', color: '#FF8C33' },
  { id: '6', name: 'Gaming', color: '#33FFF5' },
  { id: '7', name: 'Art', color: '#8C33FF' },
  { id: '8', name: 'Science', color: '#FF3333' },
  { id: '9', name: 'Fashion', color: '#33FF8C' },
  { id: '10', name: 'Movies', color: '#FF33FF' },
];

export function colorForInterest(interest: string) {
  return interests.find((i) => i.name.toLowerCase() === interest.toLowerCase())
    ?.color;
}