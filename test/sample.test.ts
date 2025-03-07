/**
 * @file sample.test.ts
 * @description Ce fichier contient les tests unitaires pour la fonction `sumFunction`
 * située dans le module `sample.ts` du répertoire utils. Les tests vérifient si la
 * fonction additionne correctement deux nombres.
 */

import { sumFunction } from '../src/utils/sample';

/**
 * Test pour la fonction `sumFunction`
 * @description Vérifie si la fonction `sumFunction` retourne la somme correcte de deux nombres.
 */
describe('sumFunction', () => {
  // Test basique d'addition de deux nombres positifs
  test('addition de deux nombres positifs', () => {
    const result = sumFunction(2, 3);
    expect(result).toBe(5);
  });

  // Test pour addition de deux nombres négatifs
  test('addition de deux nombres négatifs', () => {
    const result = sumFunction(-2, -3);
    expect(result).toBe(-5);
  });

  // Test pour addition d'un nombre positif et d'un nombre négatif
  test("addition d'un nombre positif et d'un nombre négatif", () => {
    const result = sumFunction(5, -3);
    expect(result).toBe(2);
  });

  // Test pour addition d'un nombre avec zéro
  test("addition d'un nombre et zéro", () => {
    const result = sumFunction(4, 0);
    expect(result).toBe(4);
  });

  // Test pour addition de deux zéros
  test('addition de zéro avec zéro', () => {
    const result = sumFunction(0, 0);
    expect(result).toBe(0); // Vérifie que 0 + 0 = 0
  });

  // Test pour addition d'un grand nombre
  test('addition de grands nombres', () => {
    const result = sumFunction(1000000, 1000000);
    expect(result).toBe(2000000); // Vérifie que 1000000 + 1000000 = 2000000
  });
});
