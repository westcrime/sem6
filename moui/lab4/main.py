import numpy as np

def dual_simplex_method(c_T, A, b_T, B):
    n = len(c_T)
    m = len(B)
    while True:
        A_B = A[:, B]
        A_B_inv = np.linalg.inv(A_B) # Первый шаг
        c_T_B = c_T[B] # Второй шаг
        y_T = np.dot(c_T_B, A_B_inv) # Третий шаг
        k = np.zeros(n)  # Четвертый шаг
        k_B = np.dot(A_B_inv, b_T)
        for i in range(n):
            if i in B:
                k[i] = k_B[np.where(B == i)]
        if np.all(k >= 0): # Пятый шаг
            return k
        negative_indices = np.where(k < 0) # Шестой шаг
        j_k = negative_indices[0][0]
        j_k_index = np.where(B == j_k)
        d_y_T = A_B_inv[j_k_index]
        u = np.dot(d_y_T, A) # Седьмой шаг
        if np.all(u >= 0): # Восьмой шаг
            raise 'Прямая задача не совместна'
        sigma = (c_T - np.dot(A.transpose(), y_T)) / u
        sigma[u >= 0] = np.inf
        sigmas = []
        sigma = sigma[0]
        for i in range(len(sigma)): # Девятый шаг
            if i not in B:
                sigmas.append(sigma[i])
        sigma_0 = np.min(sigmas)
        j_0 = np.where(sigma == sigma_0)[0][0] # Десятый шаг
        B[j_k_index] = j_0 # Одиннадцатый шаг

c_T = np.array([-4, -3, -7, 0, 0], dtype=float)
A = np.array([[-2, -1, -4, 1, 0], [-2, -2, -2, 0, 1]], dtype=float)
b_T = np.array([-1, -1.5], dtype=float)
B = np.array([4 - 1, 5 - 1], dtype=int)
print(dual_simplex_method(c_T, A, b_T, B))    