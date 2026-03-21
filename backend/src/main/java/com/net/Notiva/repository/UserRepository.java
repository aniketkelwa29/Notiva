package com.net.Notiva.repository;

import com.net.Notiva.entity.Roles;
import com.net.Notiva.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User,String> {

    User findByUserName(String userName);

    List<User> findByRole(Roles roles);



}
