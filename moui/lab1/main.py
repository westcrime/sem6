def findNewInvertedMatrix(invertedMatrix, x, i):
    n = len(x)

    # first step
    
    l = [0] * n
    for (rowIndex, row) in enumerate(invertedMatrix):
        for (colIndex, element) in enumerate(row):
            l[rowIndex] += element * x[colIndex]

    # second step

    li = l[i]
    if li == 0:
        return None
    li = -1 / li
    l[i] = -1

    # third step

    for (index, element) in enumerate(l):
        l[index] = li * element

    # fourth and fifth step

    result = [None] * n
    for (rowIndex, row) in enumerate(invertedMatrix):
        result[rowIndex] = [None] * n
        for (colIndex, element) in enumerate(row):
            result[rowIndex][colIndex] = element + l[rowIndex]*invertedMatrix[i][colIndex]
    result[i][i] = l[i] * invertedMatrix[i][i]

    return result


def int_input(prompt, min, max):
    while(True):
        n = input(prompt)
        try:
            n = int(n)
            if n >= min and n <= max:
                return n
        except:
            pass
        print("Invalid input!")


def float_input(prompt, min, max):
    while(True):
        n = input(prompt)
        try:
            n = float(n)
            if n >= min and n <= max:
                return n
        except:
            pass
        print("Invalid input!")


def main():

    invertedMatrix = [[1, -1, 0], [0, 1, 0], [0, 0, 1]]
    x = [1, 0, 1]
    i = 2

    result = findNewInvertedMatrix(invertedMatrix, x, i)
    if result is None:
        print("Matrix is not invertable!")
    else:
        print("Result:")
        for row in result:
            for col in row:
                print(col, end=' ')
            print()


if __name__ == "__main__":
    main()
