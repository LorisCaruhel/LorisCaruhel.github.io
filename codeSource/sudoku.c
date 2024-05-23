/**
 * @page Général
* @file main.c
* @brief Un sudoku avec 10 grille prédéfinie.
* @author Loris Caruhel
* @version v1.0
* @date 23/11/2023
*/

#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <unistd.h>

/** 
 * @def N 
 * @brief Définie le N majuscule par 9 pour la taille de la grille.
*/
#define N 3

/** 
 * @def TAILLE
 * @brief Définie la taille de la grille (N*N = 3*3 = 9).
*/
#define TAILLE (N*N)

/** 
 * @def CASE_VIDE
 * @brief Représentation d'une case vide.
*/
const int CASE_VIDE = 0;

/** 
 * @def LIGNE_SEPARATION
 * @brief Ligne de séparation lors de l'affichage de grille.
*/
const char LIGNE_SEPARATION[28] = "  +-------+-------+-------+";

/** 
 * @def CARAC_POINT
 * @brief Le caractère point pour l'affichage des 0 dans la grille du sudoku (Affiche . au lieu des 0).
*/
const char CARAC_POINT[2] = ".";

/** 
 * @def CARAC_PIPE
 * @brief Le caractère pipe pour la séparation des différentes cases.
*/
const char CARAC_PIPE[2] = "|";

/** 
 * @def ESPACE
 * @brief La caractère espace qui sépare chaque chiffre lors de l'affichage de la grille.
*/
const char ESPACE[2] = " ";

/**
 * @typedef tgrille 
 * @brief Définis le type de la grille du sudoku comme un type.
*/
typedef int tgrille[TAILLE][TAILLE]; 


void chargerGrille(tgrille *g);
void affichageGrille();
void saisir(int *testValeur);
bool possible(tgrille testSaisieGrille, int numLigne, int numColonne, int valeur);
bool testGrillePleine(tgrille testGrilleSudoku);
int nbElementsLigne(tgrille g, int lig);
int nbElementsColonne(tgrille g, int col);


/**
 * @fn main()
 * @brief Fonction qui regroupe l'ensemble du jeu (Le corps du sudoku) et qui fait appel aux différentes fonction définis.
 * @return Retourne un entier qui spécifie que tous c'est bien passé dans cette fonction.
*/

int main()
{
    int ligne, colonne, numero; 
    bool finPartie = false;

    tgrille grilleSudoku;
    system("clear");

    chargerGrille(&grilleSudoku);
    printf("Grille chargé avec succès !\n");
    sleep(2);

    affichageGrille(grilleSudoku);

    int lig = 3; //Ligne a laquelle on veut le nombre de valeur non nul.
    lig = lig - 1; //Convertion pour que le numéro de la ligne colle avec les numéro de la ligne lors de l'affichage.

    int col = 3;//Colonne a laquelle on veut le nombre de valeur non nul.
    col = col - 1;//Convertion pour que le numéro de la colonne colle avec les numéro de la colonne lors de l'affichage.
    printf("\nlig = %d\n", nbElementsLigne(grilleSudoku, lig));
    printf("\ncol = %d\n", nbElementsColonne(grilleSudoku, col));

    
    while(!finPartie)
    {
        system("clear");
        
        affichageGrille(grilleSudoku);

        printf("Indice de la case ? ligne puis colonne (entier de 1 à 9) :\n");
        saisir(&ligne);
        saisir(&colonne);

        ligne = ligne - 1; ///Conversions pour que la ligne et la colonne affichées dans le terminal correspondent, car un tableau en C commence à 0.
        colonne = colonne - 1;

        if(grilleSudoku[ligne][colonne] != CASE_VIDE)
        {
            printf("IMPOSSIBLE, la case n'est pas libre. Réessayer. (Patientez)\n");
            sleep(2.5);
        }
        else
        {
            printf("Valeur à insérer ? (entier de 1 à 9)\n");
            saisir(&numero);

            if(possible(grilleSudoku, ligne, colonne, numero) == true)
            {
                grilleSudoku[ligne][colonne] = numero;
            }
            if(testGrillePleine(grilleSudoku) == true)
            {
                finPartie = true;
            }
        }
    }
    printf("Grille pleine, fin de partie, Bravo !");
    

    return EXIT_SUCCESS;
}

int nbElementsLigne(tgrille g, int lig)
{
    int nbElementsLigne = 0;

    for(int i = 0; i < TAILLE; i++)
    {
        if(g[lig][i] != 0)
        {
            nbElementsLigne++;
        }
    }

    return nbElementsLigne;
}

int nbElementsColonne(tgrille g, int col)
{
    int nbElementsColonne = 0;

    for(int i = 0; i < TAILLE; i++)
    {
        if(g[i][col] != 0)
        {
            nbElementsColonne++;
        }
    }

    return nbElementsColonne;
}


/**
 * @fn testGrillePleine(tgrille testGrilleSudoku)
 * @brief : Fonction qui permet de tester si la grille est pleine et renvoie true si c'est le cas, sinon false et le jeu continue.
 * @param testGrilleSudoku : Grille du sudoku.
 * @return Retourne un booléen qui est vrai si la grille est pleine et false si il reste des 0 dans la grille.
*/

bool testGrillePleine(tgrille testGrilleSudoku)
{
    bool grillePeine = true;

    for (int lig = 0; lig < TAILLE; lig++)
    {
        for (int col = 0; col < TAILLE; col++)
        {
            if(testGrilleSudoku[lig][col] == 0)
            {
                grillePeine = false;
            }
        }
    }

    return grillePeine;
}

/**
 * @fn possible(tgrille testSaisieGrille, int numLigne, int numColonne, int valeur)
 * @brief : Fonction qui réalise des tests pour savoir si le numéro saisie par l'utilisateur peut être entré et qu'il n'est déjà pas
 *          présent dans la ligne, ni dans la colonne et ni dans son carré 3x3.
 * @param numLigne : Paramètre qui permet de mettre la valeur de la ligne que l'utilisateur à rentré.
 * @param numColonne : Même chose que ligne mais pour la colonne.
 * @param valeur : Même chose que ligne et colonne mais pour le chiffre que l'utilisateur veut mettre dans la grille.
 * @param testSaisieGrille : Matrice du sudoku initialisé dans le main (grille de 9 par 9).
 * @return Retourne un booléen qui retourne vrai si le placement de la valeur à insérer est possible sinon retourne false et affiche un message d'erreur. 
*/

bool possible(tgrille testSaisieGrille, int numLigne, int numColonne, int valeur)
{
    bool possible = false;
    bool nonPossible = false;

    int i = 0;

    int iLigCase = (numLigne / N) * N;    ///Convertis le numéro de ligne que l'utilisateur à rentré au numéro que la vérif par case doit commencer.    
    int iColCase = (numColonne / N) * N; 


    for (int lig = iLigCase; lig <= iLigCase + 2; lig++)
    {
        for (int col = iColCase; col <= iColCase + 2; col++)
        {
            if(testSaisieGrille[iLigCase][iColCase] == valeur)
            {
                nonPossible = true;
            }
        }
    }
    if(nonPossible == true)
    {
        printf("Nombre déjà saisie dans la case. Réessayer. (Patientez)\n");
        sleep(2.5);
    }


    while(i < (TAILLE-1) && !nonPossible) ///Boucle pour chercher si la valeur est déjà dans la ligne.
    {
        if(testSaisieGrille[numLigne][i] == valeur)
        {
            nonPossible = true;
            printf("Nombre déjà saisie dans la ligne. Réessayer. (Patientez)\n");
            sleep(2.5);
        }
        i++;
    }

    i = 0;
        
    while(i < (TAILLE-1) && !nonPossible) ///Boucle pour chercher si la valeur est déjà dans la colonne
    {
        if(testSaisieGrille[i][numColonne] == valeur)
        {
            nonPossible = true;
            printf("Nombre déjà saisie dans la colonne. Réessayer. (Patientez)\n");
            sleep(2.5);
        }
        i++;
    }

    if(nonPossible == false)
    {
        possible = true;
    }

    return possible;
}


/**
 * @fn saisir(int *testValeur)
 * @brief Procédure qui scanne l'entrée de l'utilisateur pour saisir une valeur et qui redemande si ce n'est pas un 
 *          entier entre 1 et 9 en signalant une erreur dans TOUS les autres cas.
 * @param testValeur : Valeur à tester.
*/

void saisir(int *testValeur)
{
    bool verif = false;
    int valeurConvertis; ///Variable pour stocker la conversion en entier si elle a été réussite et la récuperer dans le main en passant par la variable de paramètre de la fonction.
    char ch[20]; ///Chaîne de caractère qui contient la saisie de l'utilisateur que se soit un nombre ou pas.

    while(!verif)
    {
        scanf("%s", ch);

        if(sscanf(ch, "%d", &valeurConvertis) != 0)
        {
            if (valeurConvertis > 0 && valeurConvertis < (TAILLE - 1))
            {
                *testValeur = valeurConvertis;
                verif = true;
            } 
            else 
            {
                printf("Erreur, valeur saisie erronée. Réessayé (entrez un entier de 1 à 9) : \n");          
            }
        } 
        else 
        {
            printf("Erreur, valeur saisie erronée. Réessayé (entrez un entier de 1 à 9) : \n");
        }
    }
}


/**
 * @fn chargerGrille(tgrille *g)
 * @brief : Procédure qui scanne l'entrée de l'utilisateur pour les lignes et colonnes et qui redemande si ce n'est pas un 
 *          entier entre 1 et 9 en signalant une erreur dans TOUS les autres cas.
 * @param g : Grille du sudoku.
*/

void chargerGrille(tgrille *g)
{
    char nomFichier[30]; ///Variable qui va stocker le nom du fichier à charger dans la grille.
    FILE * f;

    printf("Nom du fichier ? (Grille[1-10].sud)\n");
    scanf("%s", nomFichier);

    f = fopen(nomFichier, "rb");
    if (f==NULL)
    {
        printf("\n Fichier %s n'existe pas.\n", nomFichier);
    } 
    else 
    {
        fread(g, sizeof(int), TAILLE*TAILLE, f);
    }
    fclose(f);
}


/**
 * @fn affichageGrille(tgrille grilleAffichage)
 * @brief : Procédure assez explicite dans le nom qui permet d'afficher la grille.
 * @param grilleAffichage : Grille du sudoku suite au chargement fait précédement dans le main.
*/
void affichageGrille(tgrille grilleAffichage)
{
    printf("    1 2 3   4 5 6   7 8 9\n");
    printf("%s\n", LIGNE_SEPARATION);

    for (int lig = 0; lig < TAILLE; lig++) 
    {
        if (lig % N == 0 && lig != 0) //Si le parcour des lignes est un multiple de trois afficher la ligne séparatrice. 
        {
            printf("%s\n", LIGNE_SEPARATION);
        }

        printf("%d %s ", lig + 1, CARAC_PIPE); // Affiche le premier pipe à chaques lignes.

        for (int col = 0; col < TAILLE; col++) 
        {
            if(grilleAffichage[lig][col] == 0) //Change les zéros en point sinon affiche le nombre "normal".
            {
                printf("%s", CARAC_POINT);
            }
            else
            {
                printf("%d", grilleAffichage[lig][col]);
            }

            if (col % N == 2 && col != (TAILLE - 1)) //Si le parcours des colonnes est un multiple de trois afficher le pipe sinon faire simplement un espace
            {
                printf(" %s ", CARAC_PIPE);
            } 
            else 
            {
                printf("%s", ESPACE);
            }
        }

        printf("%s (%d)\n", CARAC_PIPE, nbElementsLigne(grilleAffichage, lig)); //Affiche le dernier pipe à la fin de chaque ligne
    }

    printf("%s\n", LIGNE_SEPARATION);

    printf("  ");
    for(int col = 0; col < N; col++)
    {
        printf("(%d)", nbElementsColonne(grilleAffichage, col));
    }

    for(int col = N; col < 6; col++)
    {
        printf("(%d)", nbElementsColonne(grilleAffichage, col));
    }

    for(int col = 6; col < TAILLE; col++)
    {
        printf("(%d)", nbElementsColonne(grilleAffichage, col));
    }

    printf("\n");
}
