// Couche présentation : affiche ce qu'on lui donne, sans accès aux données.
export function ExampleView({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
