import numpy as np
from numpy.linalg import inv


###values###
C = np.array(   [   [   8,  4,  1   ],
                    [   8,  4,  3   ],
                    [   9,  7,  5   ]   ]   )
a = np.array([  100,    300,    300 ])
b = np.array([  300,    200,    200 ])
###values###


def north_west(a, b):
    X = np.zeros((a.shape[0], b.shape[0]))
    B = [None] * (a.shape[0] + b.shape[0] - 1)
    aIndex = 0
    bIndex = 0

    while aIndex < a.shape[0] and bIndex < b.shape[0]:
        
        if a[aIndex] < b[bIndex]:
            X[aIndex, bIndex] = a[aIndex]
            b[bIndex] -= a[aIndex]
            B[aIndex + bIndex] = (aIndex, bIndex)
            aIndex += 1
        else:
            X[aIndex, bIndex] = b[bIndex]
            a[aIndex] -= b[bIndex]
            B[aIndex + bIndex] = (aIndex, bIndex)
            bIndex += 1
        
    return X, B


def prepare(a, b, C):
    sum_a = np.sum(a)
    sum_b = np.sum(b)

    diff = sum_a - sum_b

    if diff > 0:
        b = np.append(b, [diff], 0)
        C = np.c_[ C, np.zeros(a.shape[0])]
    
    if diff < 0:
        a = np.append(a, [-diff], 0)
        C = np.r_[ C, np.array([np.zeros(b.shape[0])]) ]

    return a, b, C


def transport_problem(C, a, b):
    a, b, C = prepare(a, b, C)
    X, B = north_west(a, b)

    while True:
        u = [0] * a.shape[0]
        v = [0] * b.shape[0]
        uIndexes = [0]
        vIndexes = []

        while len(uIndexes) != a.shape[0] or len(vIndexes) != b.shape[0]:

            for pair in B:

                if pair[0] in uIndexes and pair[1] not in vIndexes:
                    v[pair[1]] = C[pair[0], pair[1]] - u[pair[0]]
                    vIndexes.append(pair[1])

                if pair[1] in vIndexes and pair[0] not in uIndexes:
                    u[pair[0]] = C[pair[0], pair[1]] - v[pair[1]]
                    uIndexes.append(pair[0])

        incorrect_pair = None

        for uIndex, uElement in enumerate(u):

            for vIndex, vElement in enumerate(v):
                if uElement + vElement > C[uIndex, vIndex]:
                    incorrect_pair = (uIndex, vIndex)
                    break
            if incorrect_pair is not None:
                break
            

        if incorrect_pair is None:
            return X, B

        B.append(incorrect_pair)
        simple_loop = B.copy()

        index = 0

        while index != len(simple_loop):
            more_with_row = False
            more_with_col = False

            for tmpIndex in range(len(simple_loop)):
                
                if tmpIndex != index and simple_loop[tmpIndex][0] == simple_loop[index][0]:
                    more_with_row = True
                
                if tmpIndex != index and simple_loop[tmpIndex][1] == simple_loop[index][1]:
                    more_with_col = True

            if not more_with_row or not more_with_col:
                del simple_loop[index]
                index = 0
            
            index += 1

        min_value = 0
        for index in range(len(simple_loop) - 2, -1, -2):
            if X[simple_loop[index][0], simple_loop[index][1]] < X[simple_loop[min_value][0], simple_loop[min_value][1]]:
                min_value = index
        
        for index, pair in enumerate(reversed(simple_loop)):
            if index % 2 == 0:
                X[pair[0], pair[1]] += X[simple_loop[min_value][0], simple_loop[min_value][1]]
            else:
                X[pair[0], pair[1]] -= X[simple_loop[min_value][0], simple_loop[min_value][1]]

        old_B = B
        B = []
        for i in range(min_value + 1, len(old_B)):
            B.append(old_B[i])
        for i in range(min_value):
            B.append(old_B[i])


def main():
    print(transport_problem(C, a, b))


if __name__ == "__main__":
    main()